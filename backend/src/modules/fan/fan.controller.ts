import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ChangeFanStatusDto } from './dto/fan.dto';
import { FanService } from './fan.service';
import { FanType, FansType } from './models/fan.model';
import { OptionalParseIntPipe } from '../../common/customPipe';

@Controller('api/v1/actuator/fan')
export class FanController {
  constructor(private readonly fanService: FanService) {}
  // TODO: fix after discussing with Mr. Hai
  @Post()
  public changeFanStatus(
    @Body('dto')
    dto: ChangeFanStatusDto,
  ): Promise<boolean> {
    return this.fanService.changeFanStatus(dto);
  }

  @Get('/latest')
  public getFanLatestStatus(): Promise<FanType> {
    return this.fanService.getFanLatestStatus();
  }

  @Get('/:id')
  public getHistoryFanStatus(
    @Query('page', new OptionalParseIntPipe()) page?: number,
    @Query('limit', new OptionalParseIntPipe()) limit?: number,
  ): Promise<FansType> {
    return this.fanService.getHistoryFanStatus({
      page: page || 1,
      limit: limit || 10,
    });
  }
}
