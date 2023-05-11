import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/prisma.service';
import { FanData, Prisma } from '@prisma/client';

@Injectable()
export class FanDataRepository implements IFanDataRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getFanDataLatestStatus(deviceId: number) {
    return this.prisma.fanData.findFirst({
      where: {
        deviceId,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async getHistoryFanDatas(args: Prisma.FanDataFindManyArgs) {
    return this.prisma.fanData.findMany(args);
  }
}

export interface IFanDataRepository {
  getFanDataLatestStatus(deviceId: number): Promise<FanData>;
  getHistoryFanDatas(args: Prisma.FanDataFindManyArgs): Promise<FanData[]>;
}
