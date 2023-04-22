import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GardenRepository } from '../../repositories/garden.repository';
import {
  GardenDetail,
  GardenDetailType,
  GardensType,
} from './models/garden.model';
import { Prisma } from '@prisma/client';
import { responseSuccess } from 'src/common/responseSuccess';

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

  async getGardens(): Promise<GardensType> {
    const gardens = await this.gardenRepository.getGardens();
    return responseSuccess(200, gardens);
  }
}
