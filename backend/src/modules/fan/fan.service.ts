import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PublicMqttService } from 'src/mqtt/publish';
import { Redis } from 'ioredis';
import { ChangeFanStatusDto } from './dto/fan.dto';
import { GardenRepository } from '../../repositories/garden.repository';
import { messageToMqtt } from '../../common/messageToMqtt';
import { FanRepository } from '../../repositories/fan.repository';

@Injectable()
export class FanService {
  private readonly redis: Redis;
  constructor(
    private readonly mqttService: PublicMqttService,
    private readonly fanRepository: FanRepository,
    private readonly gardenRepository: GardenRepository,
  ) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.CACHE_PORT
        ? parseInt(process.env.CACHE_PORT, 10)
        : 6998,
    });
  }

  async getFanLatestStatus() {
    return this.fanRepository.getFanLatestStatus();
  }

  async changeFanStatus(changeFanStatusDto: ChangeFanStatusDto) {
    const garden = await this.gardenRepository.getGardenByName(
      changeFanStatusDto.gardenName,
    );
    if (!garden) {
      throw new HttpException(
        `Garden not found with name: ${changeFanStatusDto.gardenName}`,
        HttpStatus.NOT_FOUND,
      );
    }
    const topic = await this.redis.get('newTopic');
    if (topic) {
      this.mqttService.sendMessage(
        `datn/${topic}/actuator`,
        messageToMqtt(
          topic,
          {
            ...changeFanStatusDto,
            actuatorName: 'fan',
          },
          garden.id,
        ),
      );
      return true;
    }
    //TODO: need handle case topic is null
    return false;
  }
}
