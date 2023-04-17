import { Injectable } from '@nestjs/common';
import { PublicMqttService } from 'src/mqtt/publish';
import { Redis } from 'ioredis';
import { ChangeFanStatusDto } from './dto/fan.dto';

@Injectable()
export class FanService {
  private readonly redis: Redis;
  constructor(private readonly mqttService: PublicMqttService) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.CACHE_PORT
        ? parseInt(process.env.CACHE_PORT, 10)
        : 6998,
    });
  }

  async changeFanStatus(changeFanStatusDto: ChangeFanStatusDto) {
    const topic = await this.redis.get('newTopic');
    if (topic) {
      this.mqttService.sendMessage(topic, JSON.stringify(changeFanStatusDto));
      return true;
    }
    //TODO: need handle case topic is null
    return false;
  }
}
