import { Optional } from '@nestjs/common';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export interface IChangeFanStatusDto {
  value: number;
  status: boolean;
  ip: string;
}

export class ChangeFanStatusDto {
  @IsNumber()
  @Optional()
  value?: number;
  @IsBoolean()
  status: boolean;
  @IsString()
  ip: string;
  static transform(arg: ChangeFanStatusDto): IChangeFanStatusDto {
    return {
      value: arg?.value,
      status: arg.status,
      ip: arg.ip,
    };
  }
}
