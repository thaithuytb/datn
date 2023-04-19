import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GardenRepository } from '../../repositories/garden.repository';
import { GardenDetail, Gardens } from './models/garden.model';
import { Prisma } from '@prisma/client';

@Injectable()
export class GardenService {
  constructor(private readonly gardenRepository: GardenRepository) {}

  async getGardenById(id: number): Promise<GardenDetail> {
    const query: Prisma.GardenFindFirstArgsBase = {
      where: {
        id
      },
      include: {
        fans: {
          distinct: 'ip',
          select: {
            ip: true
          }
        },
        nebulizers: {
          distinct: 'ip',
          select: {
            ip: true
          }
        },
        pumps: {
          distinct: 'ip',
          select: {
            ip: true
          }
        },
        humis: {
          distinct: 'ip',
          select: {
            ip: true
          }
        },
        lights: {
          distinct: 'ip',
          select: {
            ip: true
          }
        },
        tempAirs: {
          distinct: 'ip',
          select: {
            ip: true
          }
        }
      }
    }

    const garden = await this.gardenRepository.getGardenById(query) as GardenDetail;
    if (!garden) {
      throw new HttpException(`Garden not found with id: ${id}`, HttpStatus.NOT_FOUND)
    }

    return garden
  }

  async getGardens(): Promise<Gardens> {
    const gardens = await this.gardenRepository.getGardens();  
    return {
      gardens
    }
  }
}
