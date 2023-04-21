import { PrismaClient } from '@prisma/client';
import * as mqtt from 'mqtt';
import { newTopicJWT } from '../common/setJwtMqtt';
import { uuid } from 'uuidv4';
import { Redis } from 'ioredis';
import { FanGateway } from '../socket/fan/fan.socket.gateway';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

export async function subscribeMqtt(fanGateway: FanGateway) {
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
    }, 60000*3); //3m- NOTE:interval only has 32 bit
  });

  client.on('message', async function (topic, message) {
    const parseMessage = JSON.parse(message.toString() as unknown as string);
    if (parseMessage['from'] === 'web') {
      console.log('message from web');
      return;
    }

    if (!parseMessage['gardenName']) {
      return console.log('error: gardenName is required');
    }

    const garden = await prisma.garden.findFirst({
      where: {
        name: parseMessage['gardenName'],
      },
    });
    if (!garden) {
      return console.log('error: garden not found');
    }
    const gardenId = garden.id;
    //check topic here
    switch (topic.slice(15)) {
      case '/sample': {
        await prisma.sample.create({
          data: {
            name: message.toString(),
            status: false,
          },
        });
        break;
      }
      case '/sensor': {
        switch (parseMessage['data']['sensorName']) {
          case 'temp_air': {
            await prisma.tempAir.create({
              data: {
                temp: parseMessage['data']['temp'],
                tempThreshold: parseMessage['data']['tempThreshold'],
                airHumidity: parseMessage['data']['airHumidity'],
                airHumidityThreshold:
                  parseMessage['data']['airHumidityThreshold'],
                ip: parseMessage['data']['ip'],
                gardenId,
              },
            });
            break;
          }
          case 'humi': {
            await prisma.light.create({
              data: {
                value: parseMessage['data']['value'],
                threshold: parseMessage['data']['threshold'],
                ip: parseMessage['data']['ip'],
                gardenId,
              },
            });
            break;
          }
          case 'light': {
            await prisma.light.create({
              data: {
                value: parseMessage['data']['value'],
                threshold: parseMessage['data']['threshold'],
                ip: parseMessage['data']['ip'],
                gardenId,
              },
            });
            break;
          }
          default: {
            console.log('error: /sensor ', parseMessage['data']['sensorName']);
          }
        }
        break;
      }
      case '/actuator': {
        switch (parseMessage['data']['actuatorName']) {
          case 'fan': {
            const data = await prisma.fan.create({
              data: {
                value: parseMessage['data']['value'],
                status: parseMessage['data']['status'],
                ip: parseMessage['data']['ip'],
                gardenId,
              },
            });
            if (data) {
              fanGateway.server.emit('newFanStatus', data);
            }
            break;
          }
          default: {
            console.log(
              'error: no name in /actuator ',
              parseMessage['data']['actuatorName'],
            );
          }
        }
        break;
      }
      default: {
        console.log('topic', topic);
        console.log('Received message:', message.toString());
      }
    }
  });
}
