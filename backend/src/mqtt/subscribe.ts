import { PrismaClient, ThresholdNameEnum } from '@prisma/client';
import * as mqtt from 'mqtt';
import { newTopicJWT } from '../common/setJwtMqtt';
import { uuid } from 'uuidv4';
import { Redis } from 'ioredis';
import { SocketGateway } from '../socket/socket.gateway';
import { convertData } from '../modules/device/device.service';

export async function subscribeMqtt(socketGateway: SocketGateway) {
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
    const initTopic = uuid().slice(0, 10);
    client.publish('datn/changeTopic', newTopicJWT(initTopic));
    client.subscribe(`datn/${initTopic}/#`);
    await redis.set('newTopic', initTopic);
    setInterval(async () => {
      const oldTopic = await redis.get('newTopic');
      const newTopic = uuid().slice(0, 10);
      client.publish('datn/changeTopic', newTopicJWT(newTopic));
      await redis.set('newTopic', newTopic);
      client.subscribe(`datn/${newTopic}/#`);
      console.log('subscribe topic: ', `datn/${newTopic}`);
      client.unsubscribe(`datn/${oldTopic}/#`);
      console.log('unsubscribe topic: ', `datn/${oldTopic}`);
    }, 60000000 * 3); //3m- NOTE:interval only has 32 bit
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
      const newTopic = await redis.get('newTopic');
      client.publish('datn/changeTopic', newTopicJWT(newTopic));
      return;
    }

    if (topic.slice(15) === '/initStatusDevice') {
      const gardenId = parseMessage['gardenId'];
      const garden = await getGarden(prisma, gardenId);
      if (garden) {
        const statusDevices = await getStatusDevicesByGardenId(
          prisma,
          garden.id,
        );
        const thresholds = await getThresholdsByGardenId(prisma, garden.id);
        const newTopic = await redis.get('newTopic');
        client.publish(
          `datn/${newTopic}/regime`,
          JSON.stringify({
            from: 'web',
            isAuto: garden.isAuto,
          }),
        );
        for (const statusDevice of statusDevices) {
          client.publish(
            `datn/${newTopic}/actuator`,
            JSON.stringify({
              from: 'web',
              ...statusDevice,
            }),
          );
        }
        for (const threshold of thresholds) {
          client.publish(
            `datn/${newTopic}/threshold`,
            JSON.stringify({
              from: 'web',
              lowThreshold: JSON.parse(threshold.lowThreshold.toString()),
              highThreshold: JSON.parse(threshold.highThreshold.toString()),
              name: threshold.name,
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
      console.log('regime', parseMessage);
      return updateStatusGarden(prisma, parseMessage);
    }

    if (topic.slice(15) === '/threshold') {
      socketGateway.emitToGarden(
        parseMessage['gardenId'].toString(),
        'newThreshold',
        parseMessage,
      );
      console.log('threshold', parseMessage);
      return updateThreshold(prisma, parseMessage);
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
          // socketGateway.server.emit('newStatus', parseMessage);
          if (device.type === 'TEMPAIRSENSOR') {
            return console.log({ sensor: parseMessage });
            // return prisma[convertData[device.type]].create({
            //   data: {
            //     temp: parseMessage['temp'],
            //     airHumidity: parseMessage['airHumidity'],
            //     deviceId,
            //     gardenId: device.gardenId,
            //   },
            // });
          } else {
            return console.log({ sensor: parseMessage });
            // return prisma[convertData[device.type]].create({
            // data: {
            //   value: parseMessage['value'],
            //   deviceId,
            //   gardenId: device.gardenId,
            // },
            // });
          }
        }
        case '/actuator': {
          socketGateway.emitToGarden(
            // device.gardenId.toString(),
            '1',
            'newStatus',
            parseMessage,
          );
          return prisma[convertData[device.type]].create({
            data: {
              status: parseMessage['status'],
              deviceId,
              gardenId: device.gardenId,
            },
          });
        }
        default: {
          console.log('topic', topic);
          console.log('Received message:', message.toString());
        }
      }
    }
  });
}

const getStatusDevicesByGardenId = async (
  prisma: PrismaClient,
  gardenId: number,
) => {
  const devices = await prisma.device.findMany({
    where: {
      gardenId,
      status: true,
    },
  });

  const promiseList = devices.map(async (device) => {
    const valueDevice = await prisma[convertData[device.type]].findFirst({
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
