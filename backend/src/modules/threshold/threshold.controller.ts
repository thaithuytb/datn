import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoleGardenGuard } from '../../guards/roleGardenGuard';
import { ThresholdService } from './threshold.service';
import { ChangeThresholdDto } from './dto/threshold.dto';

@UseGuards(RoleGardenGuard)
@Controller('api/v1/thresholds')
export class ThresholdController {
  constructor(private readonly thresholdService: ThresholdService) {}

  @Get('/:gardenId')
  async getThresholdsByGardenId(
    @Param('gardenId', ParseIntPipe) gardenId: number,
  ) {
    return this.thresholdService.getThresholdsByGardenId({ gardenId });
  }

  @Post('/change-threshold')
  async changeThreshold(
    @Body('dto')
    dto: ChangeThresholdDto,
    @Req() req: any,
  ) {
    return this.thresholdService.changeThreshold(dto, req.user.id);
  }
}
