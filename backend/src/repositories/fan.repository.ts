import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/prisma.service';
import { Fan, Prisma } from '@prisma/client';

@Injectable()
export class FanRepository implements IFanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getFanLatestStatus() {
    return this.prisma.fan.findFirst({
      orderBy: {
        id: 'desc',
      },
    });
  }

  async getHistoryFanStatus(args: Prisma.FanFindManyArgs) {
    return this.prisma.fan.findMany(args);
  }
}

export interface IFanRepository {
  getFanLatestStatus(): Promise<Fan>;
  getHistoryFanStatus(args: Prisma.FanFindManyArgs): Promise<Fan[]>;
}
