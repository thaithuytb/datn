import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/dao/prisma.service';
import { Device, Prisma } from '@prisma/client';
import { UpdateDeviceDto } from 'src/modules/device/dto/device.dto';

@Injectable()
export class DeviceRepository implements IDeviceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getDevicesByGardenId(
    arg: Prisma.DeviceFindManyArgs,
  ): Promise<Device[]> {
    return this.prisma.device.findMany(arg);
  }

  async getDeviceByDeviceId(deviceId: number): Promise<Device> {
    return this.prisma.device.findUnique({
      where: {
        id: deviceId,
      },
    });
  }

  async updateDevice(dto: UpdateDeviceDto) {
    return this.prisma.device.update({
      where: {
        id: dto.id,
      },
      data: UpdateDeviceDto.transform(dto),
    });
  }
}

export interface IDeviceRepository {
  getDevicesByGardenId(arg: Prisma.DeviceFindManyArgs): Promise<Device[]>;
}
