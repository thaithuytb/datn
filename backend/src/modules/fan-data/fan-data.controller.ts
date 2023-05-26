import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FanDataService } from './fan-data.service';
import { FanDataType, FanDatasType } from './models/fanData.model';
import { OptionalParseIntPipe } from '../../pipes/optional-parse-int-pipe';
import { RoleGardenGuard } from '../../guards/roleGardenGuard';

@UseGuards(RoleGardenGuard)
@Controller('api/v1/:gardenId/data/actuators/fans')
export class FanDataController {
  constructor(private readonly fanService: FanDataService) {}

  @Get('/:deviceId/latest')
  public getFanLatestStatus(
    @Param('deviceId', ParseIntPipe) deviceId: number,
  ): Promise<FanDataType> {
    return this.fanService.getFanLatestStatus({ deviceId });
  }

  @Get('/:deviceId')
  public getHistoryFanStatusByDeviceId(
    @Param('deviceId', ParseIntPipe) deviceId: number,
    @Query('page', new OptionalParseIntPipe()) page?: number,
    @Query('limit', new OptionalParseIntPipe()) limit?: number,
  ): Promise<FanDatasType> {
    return this.fanService.getHistoryFanStatusByDeviceId({
      page: page || 1,
      limit: limit || 10,
      deviceId,
    });
  }
}
