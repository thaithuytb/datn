import { IsNumber, IsOptional } from 'class-validator';

import { DeviceTypeEnum } from '@prisma/client';
import { IsBoolean, IsEnum, IsString } from 'class-validator';

export class ChangeDeviceStatusDto {
  @IsOptional()
  @IsBoolean()
  status?: boolean;
  @IsString()
  ip: string;
  @IsNumber()
  deviceId: number;
  @IsEnum(DeviceTypeEnum)
  type: DeviceTypeEnum;
}
