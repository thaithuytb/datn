import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/dao/prisma.service';
import { Garden, Prisma } from '@prisma/client';
import {
  CreateGardenDto,
  UpdateGardenDto,
} from '../modules/garden/dto/garden.dto';

@Injectable()
export class GardenRepository implements IGardenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getGardenByName(name: string): Promise<Garden> {
    return this.prisma.garden.findFirst({
      where: {
        name,
      },
    });
  }

  async getGardenById(arg: Prisma.GardenFindFirstArgsBase): Promise<Garden> {
    return this.prisma.garden.findFirst(arg);
  }

  //TODO: can add feature filter garden
  async getGardens(arg: Prisma.GardenFindManyArgs): Promise<Garden[]> {
    return this.prisma.garden.findMany(arg);
  }

  async createGarden(dto: CreateGardenDto) {
    return this.prisma.garden.upsert({
      where: {
        name: dto.name,
      },
      create: {
        ...CreateGardenDto.transform(dto),
      },
      update: {
        ...CreateGardenDto.transform(dto),
      },
    });
  }

  async deleteGarden(id: number) {
    return this.prisma.garden.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  async updateGarden(dto: UpdateGardenDto) {
    return this.prisma.garden.update({
      where: {
        id: dto.id,
      },
      data: UpdateGardenDto.transform(dto),
    });
  }
}

export interface IGardenRepository {
  getGardenByName(name: string): Promise<Garden>;
  getGardenById(arg: Prisma.GardenFindFirstArgsBase): Promise<Garden>;
  getGardens(arg: Prisma.GardenFindManyArgs): Promise<Garden[]>;
}
