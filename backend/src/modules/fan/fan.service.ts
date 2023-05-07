import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PublicMqttService } from '../../mqtt/publish';
import { Redis } from 'ioredis';
import { ChangeFanStatusDto } from './dto/fan.dto';
import { GardenRepository } from '../../repositories/garden.repository';
import { messageToMqtt } from '../../common/messageToMqtt';
import { FanRepository } from '../../repositories/fan.repository';
import { FanType, FansType } from './models/fan.model';
import { responseSuccess } from '../../common/responseSuccess';
import { Prisma } from '@prisma/client';

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

  async getFanLatestStatus(): Promise<FanType> {
    const fan = await this.fanRepository.getFanLatestStatus();
    return responseSuccess(200, fan);
  }

  async getHistoryFanStatusByIp(dto: {
    page: number;
    limit: number;
    ip: string;
  }): Promise<FansType> {
    const query: Prisma.FanFindManyArgs = {
      where: {
        ip: dto.ip,
      },
      orderBy: {
        id: 'desc',
      },
      skip: dto.page - 1,
      take: dto.limit,
    };
    const fans = await this.fanRepository.getHistoryFanStatus(query);
    if (fans.length) {
      return responseSuccess(200, fans);
    }
    throw new HttpException(
      `Fans not found or no records with ip: ${dto.ip}`,
      HttpStatus.NOT_FOUND,
    );
  }

  async changeFanStatus(dto: ChangeFanStatusDto) {
    const garden = await this.gardenRepository.getGardenByName(dto.gardenName);
    if (!garden) {
      throw new HttpException(
        `Garden not found with name: ${dto.gardenName}`,
        HttpStatus.NOT_FOUND,
      );
    }
    const topic = await this.redis.get('newTopic');
    if (topic) {
      this.mqttService.sendMessage(
        `datn/${topic}/actuator`,
        messageToMqtt({
          ...dto,
          actuatorName: 'fan',
        }),
      );
      return true;
    }
    //TODO: need handle case topic is null
    return false;
  }
}
