import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeviceTypeEnum, Prisma } from '@prisma/client';
import { responseSuccess } from 'src/common/responseSuccess';
import { DeviceRepository } from '../../repositories/device.repository';
import { PrismaService } from '../../infrastructures/dao/prisma.service';
import { ChangeDeviceStatusDto } from './dto/device.dto';
import { PublicMqttService } from '../../mqtt/publish';
import { Redis } from 'ioredis';
import { messageToMqtt } from '../../common/messageToMqtt';

export const convertData = {
  FAN: 'fanData',
  LAMP: 'lampData',
  CURTAIN: 'curtainData',
  PUMP: 'pumpData',
  LIGHTSENSOR: 'lightData',
  HUMISENSOR: 'humiData',
  TEMPAIRSENSOR: 'tempAirData',
};

const convertTypeDevice = (type: DeviceTypeEnum) => {
  switch (type) {
    case 'FAN':
    case 'LAMP':
    case 'CURTAIN':
    case 'PUMP': {
      return 'actuator';
    }
    default:
      return 'sensor';
  }
};

@Injectable()
export class DeviceService {
  private readonly redis: Redis;

  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly prismaService: PrismaService,
    private readonly mqttService: PublicMqttService,
  ) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.CACHE_PORT
        ? parseInt(process.env.CACHE_PORT, 10)
        : 6998,
    });
  }

  async getDevicesByGardenId(gardenId: number) {
    const query: Prisma.DeviceFindFirstArgsBase = {
      where: {
        gardenId,
      },
    };

    const devices = await this.deviceRepository.getDevicesByGardenId(query);
    if (!devices.length) {
      throw new HttpException(
        `Devices not found with gardenId: ${gardenId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    const promiseList = devices.map(async (device) => {
      const valueDevice = await this.prismaService[
        convertData[device.type]
      ].findFirst({
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      });
      return {
        ...device,
        valueDevice,
      };
    });

    const statusDevice = await Promise.all([...promiseList]);

    return responseSuccess(200, statusDevice);
  }

  async changeDeviceStatus(dto: ChangeDeviceStatusDto) {
    const topic = await this.redis.get('newTopic');
    if (topic) {
      this.mqttService.sendMessage(
        `datn/${topic}/${convertTypeDevice(dto.type)}`,
        messageToMqtt({
          ...dto,
        }),
      );
      return true;
    }
    //TODO: need handle case topic is null
    return false;
  }
}
