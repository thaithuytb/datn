import { PrismaClient } from '@prisma/client';
import * as mqtt from 'mqtt';
import { newTopicJWT } from '../common/setJwtMqtt';
import { uuid } from 'uuidv4';

const prisma = new PrismaClient();

export function subscribeMqtt() {
  //3.122.43.101:1883 is IP
  const client = mqtt.connect(
    process.env.MQTT_URL ?? 'mqtt://broker.hivemq.com:1883',
  );

  client.on('connect', async function () {
    console.log('Connected to MQTT broker');
    let topic = uuid();
    setInterval(() => {
      client.unsubscribe(`datn/${topic.slice(10)}/#`);
      console.log('unsubscribe topic: ', `datn/${topic.slice(10)}`);
      topic = uuid();
      client.publish('datn/changePassword', newTopicJWT(topic));
      console.log('jwt', newTopicJWT(topic));
      client.subscribe(`datn/${topic.slice(10)}/#`);
      console.log('subscribe topic: ', `datn/${topic.slice(10)}`);
    }, 60000 * 10); //10m //interval only has 32 bit
  });

  client.on('message', async function (topic, message) {
    //check topic here
    switch (topic.slice(16)) {
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
        const data = JSON.parse(message as unknown as string);
        //TODO: need refactor
        if (data['sensorName'] === 'temp_air') {
          await prisma.tempAir.create({
            data: {
              temp: data['temp'],
              tempThreshold: data['tempThreshold'], //TODO: change after having spec
              airHumidity: data['airHumidity'],
              airHumidityThreshold: data['airHumidityThreshold'], //TODO: change after having spec
              ip: data['ip'],
            },
          });
        } else if (data['sensorName'] === 'light') {
          await prisma.light.create({
            data: {
              value: data['value'],
              threshold: data['threshold'], //TODO: change after having spec
              ip: data['ip'],
            },
          });
        } else if (data['sensorName'] === 'humi') {
          await prisma.light.create({
            data: {
              value: data['value'],
              threshold: data['threshold'], //TODO: change after having spec
              ip: data['ip'],
            },
          });
        } else {
          break;
        }
        break;
      }
      default:
        console.log('topic', topic);
        console.log('Received message:', message.toString());
    }
  });
}
