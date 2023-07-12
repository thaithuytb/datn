import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FanDataRepository } from '../../repositories/fan-data.repository';
import { FanDataType, FanDatasType } from './models/data-statistical.model';
import { responseSuccess } from '../../common/responseSuccess';
import { Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';
import { GardenRepository } from '../../repositories/garden.repository';
import { GardenService } from '../garden/garden.service';
import { DataStatisticalRepository } from '../../repositories/humi.repository';

@Injectable()
export class DataStatisticalService {
  constructor(
    private gardenService: GardenService,
    private dataStatisticalRepository: DataStatisticalRepository,
    private readonly gardenRepository: GardenRepository,
  ) {}

  async getDataStatisticalByDate(dto: {
    userId: number;
    date: dayjs.Dayjs;
    isAdmin?: boolean;
  }): Promise<any> {
    console.log(dto.userId);
    const gardens = dto.isAdmin
      ? await this.gardenService.getGardens({})
      : await this.gardenService.getGardens({
          userId: dto.userId,
        });
    const promiseDataStatisticalRepository = gardens.data.map((data) =>
      this.dataStatisticalRepository.getDataStatistiCals(data.id, dto.date),
    );

    const dataStatisticals = await Promise.all(
      promiseDataStatisticalRepository,
    );

    return responseSuccess(
      200,
      gardens.data.map((data, index) => ({
        id: data.id,
        name: data.name,
        dataStatistical: dataStatisticals[index],
      })),
    );
  }
}
