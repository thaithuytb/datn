import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/dao/prisma.service';
import { Garden, Prisma } from '@prisma/client';

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
  async getGardens(args: Prisma.GardenFindManyArgs): Promise<Garden[]> {
    return this.prisma.garden.findMany(args);
  }
}

export interface IGardenRepository {
  getGardenByName(name: string): Promise<Garden>;
  getGardenById(arg: Prisma.GardenFindFirstArgsBase): Promise<Garden>;
  getGardens(args: Prisma.GardenFindManyArgs): Promise<Garden[]>;
}
