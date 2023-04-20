import { Body, Controller, Post } from '@nestjs/common';
import { ChangeFanStatusDto } from './dto/fan.dto';
import { FanService } from './fan.service';

@Controller('actuator/fan')
export class FanController {
  constructor(private readonly fanService: FanService) {}

  @Post()
  public changeFanStatus(
    @Body('changeFanStatusDto') changeFanStatusDto: ChangeFanStatusDto,
  ): Promise<boolean> {
    return this.fanService.changeFanStatus(changeFanStatusDto);
  }
}
