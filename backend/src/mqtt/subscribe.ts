import {
  Device,
  DeviceTypeEnum,
  NotificationType,
  PrismaClient,
  ThresholdNameEnum,
} from '@prisma/client';
import * as mqtt from 'mqtt';
import { newTopicJWT } from '../common/setJwtMqtt';
import { Redis } from 'ioredis';
import { SocketGateway } from '../socket/socket.gateway';
import { convertData } from '../modules/device/device.service';
import { NotificationService } from '../modules/notification/notification.service';
import * as dayjs from 'dayjs';

export async function subscribeMqtt(
  socketGateway: SocketGateway,
  notificationService: NotificationService,
) {
  const prisma = new PrismaClient();

  const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.CACHE_PORT ? parseInt(process.env.CACHE_PORT, 10) : 6998,
  });

  //3.122.43.101:1883 is IP
  const client = mqtt.connect(
    process.env.MQTT_URL ?? 'mqtt://broker.hivemq.com:1883',
  );

  client.on('connect', async function () {
    console.log('Connected to MQTT broker');
    client.subscribe(`datn/requestTopic`);
    //init
    const initTopic = '61d12683-f';
    client.publish('datn/changeTopic', newTopicJWT(initTopic));
    client.subscribe(`datn/${initTopic}/#`);
    await redis.set('newTopic', initTopic);
    // setInterval(async () => {
    //   const oldTopic = await redis.get('newTopic');
    //   const newTopic = '61d12683-f';
    //   client.publish('datn/changeTopic', newTopicJWT(newTopic));
    //   await redis.set('newTopic', newTopic);
    //   client.subscribe(`datn/${newTopic}/#`);
    //   console.log('subscribe topic: ', `datn/${newTopic}`);
    //   client.unsubscribe(`datn/${oldTopic}/#`);
    //   console.log('unsubscribe topic: ', `datn/${oldTopic}`);
    // }, 60000000 * 3); //3m- NOTE:interval only has 32 bit
  });

  client.on('message', async function (topic, message) {
    let parseMessage;
    try {
      parseMessage = JSON.parse(message.toString() as unknown as string);
      if (parseMessage['from'] === 'web') {
        console.log({ parseMessage });
        return console.log('message from web');
      }
    } catch (e) {
      console.log('ERROR: parse JSON');
      return;
    }

    if (topic === 'datn/requestTopic') {
      client.publish('datn/changeTopic', newTopicJWT('61d12683-f'));
      return;
    }

    if (topic.slice(15) === '/initStatusDevice') {
      const gardenId = parseMessage['gardenId'];
      if (typeof parseMessage['gardenId'] != 'number') {
        return console.log(`${parseMessage['gardenId']} is not number`);
      }
      const newTopic = await redis.get('newTopic');

      const garden = await getGarden(prisma, gardenId);
      if (garden) {
        client.publish(
          `datn/${newTopic}/regime`,
          JSON.stringify({
            from: 'web',
            isAuto: garden.isAuto,
            first: true,
          }),
        );
        const actuators = await getActuatorsByGardenId(prisma, garden.id);
        console.log({ actuators });
        for (const actuator of actuators) {
          client.publish(
            `datn/${newTopic}/operator`,
            JSON.stringify({
              from: 'web',
              first: true,
              startAt: actuator.startAt,
              endAt: actuator.endAt,
              deviceId: actuator.id,
              ip: actuator.ip,
            }),
          );
        }
        const thresholds = await getThresholdsByGardenId(prisma, garden.id);
        for (const threshold of thresholds) {
          client.publish(
            `datn/${newTopic}/threshold`,
            JSON.stringify({
              from: 'web',
              lowThreshold: JSON.parse(threshold.lowThreshold.toString()),
              highThreshold: JSON.parse(threshold.highThreshold.toString()),
              name: threshold.name,
              first: true,
            }),
          );
        }
        const latestStatusActuators = await getLatestStatusActuators(
          prisma,
          actuators,
        );
        for (const latestStatusActuator of latestStatusActuators) {
          client.publish(
            `datn/${newTopic}/actuator`,
            JSON.stringify({
              from: 'web',
              ...latestStatusActuator,
              first: true,
            }),
          );
        }
      }
      return;
    }

    if (topic.slice(15) === '/regime') {
      socketGateway.emitToGarden(
        // parseMessage['gardenId'].toString(),
        '1',
        'newStatusGarden',
        parseMessage,
      );
      if (typeof parseMessage['gardenId'] != 'number') {
        return console.log(`${parseMessage['gardenId']} is not number`);
      }
      await updateStatusGarden(prisma, parseMessage);
      if (typeof parseMessage['createdBy'] != 'number') {
        parseMessage['createdBy'] = 0;
        // return console.log(`${parseMessage['createdBy']} is not number`);
      }
      const newNotification = await notificationService.createNotifications({
        title: `Thay đổi trạng thái chăm sóc vườn cà chua`,
        description: `${
          parseMessage['createdBy'] ? 'Người dùng' : 'Hệ thống:'
        } vừa thay đổi chế độ chăm sóc sang ${
          parseMessage['isAuto'] ? 'tự động' : 'tự điều chỉnh'
        }  ${dayjs().format('YYYY-MM-DD')}`,
        type: NotificationType.GARDEN,
        createdBy: parseMessage['createdBy'] ? parseMessage['createdBy'] : 1,
        // createdBy: 1,
        gardenId: parseMessage['gardenId'],
      });
      if (newNotification) {
        socketGateway.emitToGarden(
          parseMessage['gardenId'].toString(),
          'newCountNotification',
          parseMessage,
        );
      }
    }

    if (topic.slice(15) === '/threshold') {
      if (!parseMessage['gardenId']) {
        return console.log('ERROR: no have gardenId');
      }
      socketGateway.emitToGarden(
        parseMessage['gardenId'].toString(),
        'newThreshold',
        parseMessage,
      );
      await updateThreshold(prisma, parseMessage);
      if (typeof parseMessage['createdBy'] != 'number') {
        parseMessage['createdBy'] = 0;
      }
      const newNotification = await notificationService.createNotifications({
        title: `Thay đổi ngưỡng thiết bị vườn cà chua ngày ${dayjs().format(
          'YYYY-MM-DD',
        )}`,
        description: `Thay đổi ngưỡng ${
          parseMessage['name'] === 'LIGHT_SENSOR'
            ? 'cảm biến ánh sáng'
            : parseMessage['name'] === 'HUMIDITY_SENSOR'
            ? 'cảm biến độ ẩm đất'
            : 'cảm biến nhiệt độ, độ ẩm không khí'
        }`,
        type: NotificationType.DEVICE,
        createdBy: parseMessage['createdBy'] ? parseMessage['createdBy'] : 1,
        // createdBy: 1,
        gardenId: parseInt(parseMessage['gardenId']),
      });
      if (newNotification) {
        socketGateway.emitToGarden(
          parseMessage['gardenId'].toString(),
          'newCountNotification',
          parseMessage,
        );
      }
    }

    if (topic.slice(15) === '/sensor' || topic.slice(15) === '/actuator') {
      console.log('sensor || actuator', parseMessage);
      const device = await prisma.device.findFirst({
        where: {
          ip: parseMessage['ip'],
          // id: parseInt(parseMessage['deviceId']),
        },
      });
      if (!device) {
        return console.log(
          `error: device not found with topic: /sensor || /actuator. Data: ${JSON.stringify(
            parseMessage,
          )}`,
        );
      }
      const deviceId = device.id;
      console.log(device);
      // check topic here
      switch (topic.slice(15)) {
        case '/sensor': {
          socketGateway.emitToGarden('1', 'newStatus', parseMessage);
          if (device.type === DeviceTypeEnum.TEMPERATURE_HUMIDITY_AIR_SENSOR) {
            return prisma.temperatureHumidityAirData.create({
              data: {
                temperature: parseMessage['temperature'],
                humidityAir: parseMessage['humidityAir'],
                deviceId,
                gardenId: device.gardenId,
              },
            });
          } else {
            return prisma[convertData[device.type]].create({
              data: {
                value: parseMessage['value'],
                deviceId,
                gardenId: device.gardenId,
              },
            });
          }
        }
        case '/actuator': {
          socketGateway.emitToGarden(
            // device.gardenId.toString(),
            '1',
            'newStatus',
            parseMessage,
          );
          await prisma.actuatorData.create({
            data: {
              status: parseMessage['status'],
              gardenId: device.gardenId,
              device: {
                connect: {
                  id: deviceId,
                },
              },
            },
          });

          if (typeof parseMessage['createdBy'] != 'number') {
            parseMessage['createdBy'] = 0;
            // return console.log(`${parseMessage['createdBy']} is not number`);
          }
          const newNotification = await notificationService.createNotifications(
            {
              title: `Thay đổi trạng thái thiết bị chấp hành vườn cà chua ${dayjs().format(
                'YYYY-MM-DD',
              )}`,
              description: `Thay đổi trạng thái ${
                deviceId === 1 ? 'quạt' : deviceId === 2 ? 'đèn' : 'bơm'
              }`,
              type: NotificationType.DEVICE,
              createdBy: parseMessage['createdBy']
                ? parseMessage['createdBy']
                : 1,
              // createdBy: 1,
              gardenId: parseInt(parseMessage['gardenId']),
            },
          );
          if (newNotification) {
            socketGateway.emitToGarden(
              parseMessage['gardenId'].toString(),
              'newCountNotification',
              parseMessage,
            );
          }
        }
        default: {
          console.log('topic', topic);
          console.log('Received message:', message.toString());
        }
      }
    }
  });
}

const getActuatorsByGardenId = async (
  prisma: PrismaClient,
  gardenId: number,
) => {
  const devices = await prisma.device.findMany({
    where: {
      gardenId,
      status: true,
      type: {
        in: [DeviceTypeEnum.FAN, DeviceTypeEnum.LAMP, DeviceTypeEnum.PUMP],
      },
    },
  });
  return devices;
};

const getLatestStatusActuators = async (
  prisma: PrismaClient,
  actuators: Device[],
) => {
  const promiseList = actuators.map(async (device) => {
    const valueDevice = await prisma.actuatorData.findFirst({
      where: {
        deviceId: device.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });
    return {
      deviceId: device.id,
      ip: device.ip,
      status: valueDevice.status,
    };
  });
  return await Promise.all([...promiseList]);
};

const getThresholdsByGardenId = async (
  prisma: PrismaClient,
  gardenId: number,
) => {
  const thresholds = await prisma.threshold.findMany({
    where: {
      gardenId,
    },
  });

  return thresholds;
};

const getGarden = async (prisma: PrismaClient, gardenId: number) => {
  const garden = await prisma.garden.findFirst({
    where: {
      id: gardenId,
    },
  });

  if (!garden) {
    return console.log(`error: garden not found`);
  }

  return garden;
};

const updateStatusGarden = async (prisma: PrismaClient, parseMessage: any) => {
  if (typeof parseMessage['gardenId'] !== 'number') {
    console.log('ERROR validate updateStatusGarden', parseMessage);
    return;
  }
  return prisma.garden.update({
    where: {
      id: parseMessage.gardenId,
    },
    data: {
      isAuto: parseMessage['isAuto'] ? true : false,
    },
  });
};

const updateThreshold = async (prisma: PrismaClient, parseMessage: any) => {
  if (
    typeof parseMessage['name'] !== 'string' ||
    typeof parseMessage['gardenId'] !== 'number'
  ) {
    console.log('ERROR validate updatedThreshold', parseMessage);
    return;
  }
  return prisma.threshold.updateMany({
    where: {
      name: parseMessage['name'] as ThresholdNameEnum,
      gardenId: parseMessage['gardenId'],
    },
    data: {
      lowThreshold: JSON.stringify(parseMessage['lowThreshold']),
      highThreshold: JSON.stringify(parseMessage['highThreshold']),
    },
  });
};
