import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FanDataRepository } from '../../repositories/fan-data.repository';
import { FanDataType, FanDatasType } from './models/fanData.model';
import { responseSuccess } from '../../common/responseSuccess';
import { Prisma } from '@prisma/client';

@Injectable()
export class FanDataService {
  constructor(private readonly fanRepository: FanDataRepository) {}

  async getFanLatestStatus(dto: { deviceId: number }): Promise<FanDataType> {
    const fanDataLatest = await this.fanRepository.getFanDataLatestStatus(
      dto.deviceId,
    );
    return responseSuccess(200, fanDataLatest);
  }

  async getHistoryFanStatusByDeviceId(dto: {
    page: number;
    limit: number;
    deviceId: number;
  }): Promise<FanDatasType> {
    const query: Prisma.FanDataFindManyArgs = {
      where: {
        deviceId: dto.deviceId,
      },
      orderBy: {
        id: 'desc',
      },
      skip: dto.page - 1,
      take: dto.limit,
    };
    const fanDatas = await this.fanRepository.getHistoryFanDatas(query);
    if (fanDatas.length) {
      return responseSuccess(200, fanDatas);
    }
    throw new HttpException(
      `FanDatas not found or no records with device: ${dto.deviceId}`,
      HttpStatus.NOT_FOUND,
    );
  }
}
