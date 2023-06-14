import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoleGardenGuard } from '../../guards/roleGardenGuard';
import { DeviceService } from './device.service';
import { ChangeDeviceStatusDto, ChangeThresholdDto } from './dto/device.dto';

@UseGuards(RoleGardenGuard)
@Controller('api/v1/devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post('/change-device/:gardenId')
  public changeDeviceStatus(
    @Body('dto')
    dto: ChangeDeviceStatusDto,
  ): Promise<boolean> {
    return this.deviceService.changeDeviceStatus(dto);
  }

  @Get(':gardenId')
  async getDevicesByGardensId(
    @Param('gardenId', ParseIntPipe) gardenId: number,
  ) {
    return this.deviceService.getDevicesByGardenId(gardenId);
  }

  @Post('/change-threshold/:gardenId')
  async changeThreshold(
    @Body('dto')
    dto: ChangeThresholdDto,
  ) {
    return this.deviceService.changeThreshold(dto);
  }
}
