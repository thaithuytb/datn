import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { responseSuccess } from 'src/common/responseSuccess';
import { ChangeThresholdDto } from './dto/threshold.dto';
import { PublicMqttService } from '../../mqtt/publish';
import { Redis } from 'ioredis';
import { ThresholdRepository } from '../../repositories/threshold.repository';

@Injectable()
export class ThresholdService {
  private readonly redis: Redis;

  constructor(
    private readonly thresholdRepository: ThresholdRepository,
    private readonly mqttService: PublicMqttService,
  ) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.CACHE_PORT
        ? parseInt(process.env.CACHE_PORT, 10)
        : 6998,
    });
  }

  async getThresholdsByGardenId(dto: { gardenId: number }) {
    const condition: Prisma.ThresholdFindManyArgs = {
      where: {
        gardenId: dto.gardenId,
      },
    };
    const thresholds = await this.thresholdRepository.getThresholds(condition);
    return responseSuccess(200, { thresholds });
  }

  async changeThreshold(dto: ChangeThresholdDto, userId: number) {
    const topic = await this.redis.get('newTopic');
    if (topic) {
      this.mqttService.sendMessage(
        `datn/${topic}/threshold`,
        JSON.stringify({
          from: 'web',
          ...dto,
          createdBy: userId,
        }),
      );
      return true;
    }
    //TODO: need handle case topic is null
    return false;
  }
}
