import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GardenRepository } from '../../repositories/garden.repository';
import {
  GardenDetail,
  GardenDetailType,
  GardensType,
} from './models/garden.model';
import { Prisma } from '@prisma/client';
import { responseSuccess } from 'src/common/responseSuccess';
import { ChangeStatusGardenDto, GetGardensDto } from './dto/garden.dto';
import { Redis } from 'ioredis';
import { PublicMqttService } from '../../mqtt/publish';

@Injectable()
export class GardenService {
  private readonly redis: Redis;

  constructor(
    private readonly gardenRepository: GardenRepository,
    private readonly mqttService: PublicMqttService,
  ) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.CACHE_PORT
        ? parseInt(process.env.CACHE_PORT, 10)
        : 6998,
    });
  }

  async getGardenById(id: number): Promise<GardenDetailType> {
    const query: Prisma.GardenFindFirstArgsBase = {
      where: {
        id,
      },
      include: {
        devices: {
          select: {
            id: true,
            ip: true,
            type: true,
          },
        },
        users: {
          select: {
            userId: true,
          },
          where: {
            gardenId: id,
          },
        },
      },
    };

    const garden = (await this.gardenRepository.getGardenById(
      query,
    )) as GardenDetail;
    if (!garden) {
      throw new HttpException(
        `Garden not found with id: ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return responseSuccess(200, garden);
  }

  async getGardens(dto: GetGardensDto): Promise<GardensType> {
    const query: Prisma.GardenFindManyArgs = dto.userId
      ? {
          where: {
            users: {
              some: {
                userId: dto.userId,
              },
            },
          },
        }
      : {};
    query.select = {
      id: true,
      name: true,
      isAuto: true,
    };
    const gardens = await this.gardenRepository.getGardens(query);
    return responseSuccess(200, gardens);
  }

  async changeStatusGarden(
    dto: ChangeStatusGardenDto,
    gardenId: number,
  ): Promise<boolean> {
    const { time, isAuto } = dto;
    const topic = await this.redis.get('newTopic');
    if (topic) {
      if (time) {
        this.mqttService.sendMessage(
          `datn/${topic}/regime`,
          JSON.stringify({
            from: 'web',
            gardenId,
            isAuto,
            time,
          }),
        );
        return true;
      } else {
        this.mqttService.sendMessage(
          `datn/${topic}/regime`,
          JSON.stringify({
            from: 'web',
            gardenId,
            isAuto,
          }),
        );
        return true;
      }
    }
    //TODO: need handle case topic is null
    return false;
  }
}
