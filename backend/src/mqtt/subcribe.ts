import { PrismaClient } from '@prisma/client';
import * as mqtt from 'mqtt';
const prisma = new PrismaClient();

export function subcribeMqtt() {
  //3.122.43.101:1883 is IP
  const client = mqtt.connect('mqtt://broker.hivemq.com:1883');

  client.on('connect', async function () {
    console.log('Connected to MQTT broker');
    //topic datn/testabc/...
    client.subscribe(`datn/${process.env.SECRET_TOPIC}/#`);
  });

  client.on('message', async function (topic, message) {
    //check topic here
    switch (topic.slice(process.env.SECRET_TOPIC.length + 5)) {
      case '/sample': {
        await prisma.sample.create({
          data: {
            name: message.toString(),
            status: false,
          },
        });
        break;
      }
      default:
        console.log('topic', topic);
        console.log('Received message:', message.toString());
    }
  });
}
