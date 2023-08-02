import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoleGardenGuard } from '../../guards/roleGardenGuard';
import { DeviceService } from './device.service';
import { ChangeDeviceStatusDto, UpdateDeviceDto } from './dto/device.dto';

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
  async getDeviceById(@Param('deviceId', ParseIntPipe) deviceId: number) {
    return this.deviceService.getDeviceById(deviceId);
  }

  @Patch('update')
  async updateDevice(@Body('dto') dto: UpdateDeviceDto) {
    return this.deviceService.updateDevice(dto);
  }

  @Get('garden/:gardenId')
  async getDevicesByGardensId(
    @Param('gardenId', ParseIntPipe) gardenId: number,
  ) {
    return this.deviceService.getDevicesByGardenId(gardenId);
  }
}
