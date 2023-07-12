import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/dao/prisma.service';
import { HumiData, LightData, Prisma, TempAirData } from '@prisma/client';
import * as dayjs from 'dayjs';

@Injectable()
export class DataStatisticalRepository implements IDataStatisticalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getDataStatistiCals(gardenId: number, date: dayjs.Dayjs) {
    const query = {
      where: {
        gardenId: gardenId,
        createdAt: {
          gt: dayjs(date).subtract(1, 'day').endOf('day').toISOString(),
          lt: dayjs(date).add(1, 'day').startOf('day').toISOString(),
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    };
    const humiDatas = await this.prisma.humiData.findMany(
      query as Prisma.HumiDataFindManyArgs,
    );
    const lightDatas = await this.prisma.lightData.findMany(
      query as Prisma.LightDataFindManyArgs,
    );
    const tempAirDatas = await this.prisma.tempAirData.findMany(
      query as Prisma.TempAirDataFindManyArgs,
    );
    return {
      humiDatas,
      lightDatas,
      tempAirDatas,
    };
  }

  async getHumiData(args: Prisma.HumiDataFindFirstArgs) {
    return this.prisma.humiData.findFirst(args);
  }
}

export interface IDataStatisticalRepository {
  getDataStatistiCals(
    gardenId: number,
    date: dayjs.Dayjs,
  ): Promise<{
    humiDatas: HumiData[];
    lightDatas: LightData[];
    tempAirDatas: TempAirData[];
  }>;
}
