import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/dao/prisma.service';
import { Device, Prisma } from '@prisma/client';

@Injectable()
export class DeviceRepository implements IDeviceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getDevicesByGardenId(
    args: Prisma.DeviceFindManyArgs,
  ): Promise<Device[]> {
    return this.prisma.device.findMany(args);
  }
}

export interface IDeviceRepository {
  getDevicesByGardenId(args: Prisma.DeviceFindManyArgs): Promise<Device[]>;
}
