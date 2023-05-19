import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PublicMqttService } from '../../mqtt/publish';
import { Redis } from 'ioredis';
import { ChangeFanStatusDto } from './dto/fan-data.dto';
import { GardenRepository } from '../../repositories/garden.repository';
import { messageToMqtt } from '../../common/messageToMqtt';
import { FanDataRepository } from '../../repositories/fan-data.repository';
import { FanDataType, FanDatasType } from './models/fanData.model';
import { responseSuccess } from '../../common/responseSuccess';
import { Prisma } from '@prisma/client';

@Injectable()
export class FanDataService {
  private readonly redis: Redis;
  constructor(
    private readonly mqttService: PublicMqttService,
    private readonly fanRepository: FanDataRepository,
    private readonly gardenRepository: GardenRepository,
  ) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.CACHE_PORT
        ? parseInt(process.env.CACHE_PORT, 10)
        : 6998,
    });
  }

  async getFanLatestStatus(dto: { deviceId: number }): Promise<FanDataType> {
    const fanDataLatest = await this.fanRepository.getFanDataLatestStatus(
      dto.deviceId,
    );
    return responseSuccess(200, fanDataLatest);
  }

  async getHistoryFanStatusByDeviceId(dto: {
    page: number;
    limit: number;
    deviceId: number;
  }): Promise<FanDatasType> {
    const query: Prisma.FanDataFindManyArgs = {
      where: {
        deviceId: dto.deviceId,
      },
      orderBy: {
        id: 'desc',
      },
      skip: dto.page - 1,
      take: dto.limit,
    };
    const fanDatas = await this.fanRepository.getHistoryFanDatas(query);
    if (fanDatas.length) {
      return responseSuccess(200, fanDatas);
    }
    throw new HttpException(
      `FanDatas not found or no records with device: ${dto.deviceId}`,
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
