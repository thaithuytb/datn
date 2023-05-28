import { PrismaClient } from '@prisma/client';
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
    if (topic === 'datn/requestTopic') {
      const newTopic = await redis.get('newTopic');
      client.publish('datn/changeTopic', newTopicJWT(newTopic));
      return;
    }
    const parseMessage = JSON.parse(message.toString() as unknown as string);
    //TEST
    if (parseMessage['from'] === 'web') {
      console.log('message from web');
      return;
    }

    const device = await prisma.device.findFirst({
      where: {
        ip: parseMessage['ip'],
        id: parseInt(parseMessage['deviceId']),
      },
    });

    if (!device) {
      return console.log('error: garden not found');
    }
    const deviceId = device.id;
    console.log(device);
    // check topic here
    switch (topic.slice(15)) {
      case '/sensor': {
        socketGateway.server.emit('newStatus', parseMessage);
        if (device.type === 'TEMPAIRSENSOR') {
          await prisma[convertData[device.type]].create({
            data: {
              temp: parseMessage['temp'],
              airHumidity: parseMessage['airHumidity'],
              deviceId,
              gardenId: device.gardenId,
            },
          });
        } else {
          await prisma[convertData[device.type]].create({
            data: {
              value: parseMessage['value'],
              deviceId,
              gardenId: device.gardenId,
            },
          });
        }

        break;
      }
      case '/actuator': {
        socketGateway.server.emit('newStatus', parseMessage);
        await prisma[convertData[device.type]].create({
          data: {
            status: parseMessage['status'],
            deviceId,
            gardenId: device.gardenId,
          },
        });
        break;
      }
      default: {
        console.log('topic', topic);
        console.log('Received message:', message.toString());
      }
    }
  });
}
