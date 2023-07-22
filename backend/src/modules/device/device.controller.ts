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
import { ChangeDeviceStatusDto } from './dto/device.dto';

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

  @Get('/:deviceId')
  async getDevicesById(@Param('deviceId', ParseIntPipe) deviceId: number) {
    // return this.deviceService.getDevicesByGardenId(gardenId);
  }

  @Get('garden/:gardenId')
  async getDevicesByGardensId(
    @Param('gardenId', ParseIntPipe) gardenId: number,
  ) {
    return this.deviceService.getDevicesByGardenId(gardenId);
  }
}
