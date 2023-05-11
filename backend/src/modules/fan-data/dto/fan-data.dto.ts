import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export interface IChangeFanStatusDto {
  value: number;
  status: boolean;
  deviceId: number;
}

export class ChangeFanStatusDto {
  @IsBoolean()
  status: boolean;
  @IsString()
  ip: string;
  @IsNumber()
  deviceId: number;
  @IsString()
  gardenName: string;
  @IsOptional()
  @IsNumber()
  value?: number;
  static transform(arg: ChangeFanStatusDto): IChangeFanStatusDto {
    return {
      value: arg?.value,
      status: arg.status,
      deviceId: arg.deviceId,
    };
  }
}
