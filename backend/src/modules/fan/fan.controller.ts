import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChangeFanStatusDto } from './dto/fan.dto';
import { FanService } from './fan.service';
import { Fan } from '@prisma/client';

@Controller('actuator/fan')
export class FanController {
  constructor(private readonly fanService: FanService) {}

  @Post()
  public changeFanStatus(
    @Body('changeFanStatusDto')
    changeFanStatusDto: ChangeFanStatusDto,
  ): Promise<boolean> {
    return this.fanService.changeFanStatus(changeFanStatusDto);
  }

  @Get('/latest')
  public getFanLatestStatus(): Promise<Fan> {
    return this.fanService.getFanLatestStatus();
  }
}
