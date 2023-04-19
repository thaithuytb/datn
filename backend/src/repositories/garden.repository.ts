import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/prisma.service';
import { Garden } from '@prisma/client';

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
}

export interface IGardenRepository {
  getGardenByName(name: string): Promise<Garden>;
}
