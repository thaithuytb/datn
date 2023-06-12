import { Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class PublicMqttService {
  private readonly client: mqtt.Client;

  constructor() {
    this.client = mqtt.connect('mqtt://broker.hivemq.com:1883');
  }

  public sendMessage(topic: string, message: string): void {
    console.log(`Change: topic: ${topic}, message: ${message}`);
    this.client.publish(topic, message);
  }

  test() {
    this.client.publish('datn/requestTopic', JSON.stringify({ gardenId: 1 }));
  }
}
