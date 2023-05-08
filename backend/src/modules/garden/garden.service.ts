import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GardenRepository } from '../../repositories/garden.repository';
import {
  GardenDetail,
  GardenDetailType,
  GardensType,
} from './models/garden.model';
import { Prisma } from '@prisma/client';
import { responseSuccess } from 'src/common/responseSuccess';
import { GetGardensDto } from './dto/garden.dto';

@Injectable()
export class GardenService {
  constructor(private readonly gardenRepository: GardenRepository) {}

  async getGardenById(id: number): Promise<GardenDetailType> {
    const query: Prisma.GardenFindFirstArgsBase = {
      where: {
        id,
      },
      include: {
        fans: {
          distinct: 'ip',
          select: {
            ip: true,
          },
        },
        nebulizers: {
          distinct: 'ip',
          select: {
            ip: true,
          },
        },
        pumps: {
          distinct: 'ip',
          select: {
            ip: true,
          },
        },
        humis: {
          distinct: 'ip',
          select: {
            ip: true,
          },
        },
        lights: {
          distinct: 'ip',
          select: {
            ip: true,
          },
        },
        tempAirs: {
          distinct: 'ip',
          select: {
            ip: true,
          },
        },
        users: {
          select: {
            userId: true,
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
    };
    const gardens = await this.gardenRepository.getGardens(query);
    return responseSuccess(200, gardens);
  }
}
