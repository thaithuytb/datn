import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChangeFanStatusDto } from './dto/fan.dto';
import { FanService } from './fan.service';
import { FanType, FansType } from './models/fan.model';
import { OptionalParseIntPipe } from '../../common/customPipe';
import { RoleGardenGuard } from '../../guards/roleGardenGuard';

@UseGuards(RoleGardenGuard)
@Controller('api/v1/:gardenId/actuators/fans')
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

  @Get('/:ip')
  public getHistoryFanStatusByIp(
    @Param('ip') ip: string,
    @Query('page', new OptionalParseIntPipe()) page?: number,
    @Query('limit', new OptionalParseIntPipe()) limit?: number,
  ): Promise<FansType> {
    return this.fanService.getHistoryFanStatusByIp({
      page: page || 1,
      limit: limit || 10,
      ip: ip,
    });
  }
}
