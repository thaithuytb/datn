import { PrismaClient } from '@prisma/client';
import * as mqtt from 'mqtt';
import { newTopicJWT } from '../common/setJwtMqtt';
import { uuid } from 'uuidv4';
import { Redis } from 'ioredis';

const prisma = new PrismaClient();

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.CACHE_PORT ? parseInt(process.env.CACHE_PORT, 10) : 6998,
});

export async function subscribeMqtt() {
  //3.122.43.101:1883 is IP
  const client = mqtt.connect(
    process.env.MQTT_URL ?? 'mqtt://broker.hivemq.com:1883',
  );

  client.on('connect', async function () {
    console.log('Connected to MQTT broker');
    //init
    const initTopic = uuid().slice(0, 10);
    client.publish('datn/changePassword', newTopicJWT(initTopic));
    client.subscribe(`datn/${initTopic}/#`);
    await redis.set('newTopic', initTopic);
    setInterval(async () => {
      const oldTopic = await redis.get('newTopic');
      const newTopic = uuid().slice(0, 10);
      client.publish('datn/changePassword', newTopicJWT(newTopic));
      await redis.set('newTopic', newTopic);
      client.subscribe(`datn/${newTopic}/#`);
      console.log('subscribe topic: ', `datn/${newTopic}`);
      client.unsubscribe(`datn/${oldTopic}/#`);
      console.log('unsubscribe topic: ', `datn/${oldTopic}`);
    }, 60000); //3m- NOTE:interval only has 32 bit
  });

  client.on('message', async function (topic, message) {
    const data = JSON.parse(message as unknown as string);
    if (!data['gardenName']) {
      return console.log('error: gardenName is required');
    }
    const garden = await prisma.garden.findFirst({
      where: {
        name: data['gardenName'],
      },
    });
    if (!garden) {
      return console.log('error: garden not found');
    }
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
        switch (data['sensorName']) {
          case 'temp_air': {
            await prisma.tempAir.create({
              data: {
                temp: data['temp'],
                tempThreshold: data['tempThreshold'],
                airHumidity: data['airHumidity'],
                airHumidityThreshold: data['airHumidityThreshold'],
                ip: data['ip'],
                gardenId: garden.id,
              },
            });
            break;
          }
          case 'humi': {
            await prisma.light.create({
              data: {
                value: data['value'],
                threshold: data['threshold'],
                ip: data['ip'],
                gardenId: garden.id,
              },
            });
            break;
          }
          case 'light': {
            await prisma.light.create({
              data: {
                value: data['value'],
                threshold: data['threshold'],
                ip: data['ip'],
                gardenId: garden.id,
              },
            });
            break;
          }
          default: {
            console.log('error: /sensor ', data['sensorName']);
          }
        }

        break;
      }
      case '/actuator': {
        switch (data['actuatorName']) {
          case 'fan': {
            await prisma.fan.create({
              data: {
                value: data['value'],
                status: data['status'],
                ip: data['ip'],
                gardenId: garden.id,
              },
            });
            break;
          }
          default: {
            console.log('error: /actuator ', data['actuatorName']);
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
