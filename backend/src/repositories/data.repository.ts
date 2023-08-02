import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/dao/prisma.service';
import * as dayjs from 'dayjs';
import { dayjsVps } from '../common/dayjs-vps';
import {
  HumidityData,
  LightLuxData,
  Prisma,
  TemperatureHumidityAirData,
} from '@prisma/client';

@Injectable()
export class DataStatisticalRepository implements IDataStatisticalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getDataStatistical(gardenId: number, date: dayjs.Dayjs) {
    const query = {
      where: {
        gardenId: gardenId,
        createdAt: {
          gt: dayjsVps(date.subtract(1, 'day').endOf('day')).toISOString(),
          lt: dayjsVps(date.add(1, 'day').startOf('day')).toISOString(),
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    };
    console.log({ query: JSON.stringify(query) });
    const humidityData = await this.prisma.humidityData.findMany(
      query as Prisma.HumidityDataFindManyArgs,
    );
    const lightLuxData = await this.prisma.lightLuxData.findMany(
      query as Prisma.LightLuxDataFindManyArgs,
    );
    const temperatureHumidityAirData =
      await this.prisma.temperatureHumidityAirData.findMany(
        query as Prisma.TemperatureHumidityAirDataFindManyArgs,
      );
    return {
      humidityData,
      lightLuxData,
      temperatureHumidityAirData,
    };
  }

  // async getHumiData(args: Prisma.HumiDataFindFirstArgs) {
  //   return this.prisma.humiData.findFirst(args);
  // }
}

export interface IDataStatisticalRepository {
  getDataStatistical(
    gardenId: number,
    date: dayjs.Dayjs,
  ): Promise<{
    humidityData: HumidityData[];
    lightLuxData: LightLuxData[];
    temperatureHumidityAirData: TemperatureHumidityAirData[];
  }>;
}
