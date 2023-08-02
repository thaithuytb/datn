import { IsArray, IsNumber, IsOptional } from 'class-validator';

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

export class UpdateDeviceDto {
  @IsNumber()
  id: number;

  @IsEnum(DeviceTypeEnum)
  type: DeviceTypeEnum;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @IsOptional()
  @IsString()
  startAt?: string;

  @IsOptional()
  @IsString()
  endAt?: string;

  @IsOptional()
  @IsArray()
  duration?: any[];

  @IsOptional()
  @IsArray()
  time?: any[];

  static transform(dto: UpdateDeviceDto): TransformUpdateDevice {
    return {
      id: dto.id,
      type: dto.type,
      status: dto.status,
      isDeleted: dto.isDeleted,
      startAt: dto.startAt,
      endAt: dto.endAt,
      duration: JSON.stringify(dto.duration),
      time: JSON.stringify(dto.time),
    };
  }
}

interface TransformUpdateDevice {
  id: number;
  type: DeviceTypeEnum;
  status?: boolean | null;
  isDeleted?: boolean | null;
  startAt?: string | null;
  endAt?: string | null;
  duration?: string | null;
  time?: string | null;
}
