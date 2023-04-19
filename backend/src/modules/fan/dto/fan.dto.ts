import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export interface IChangeFanStatusDto {
  value: number;
  status: boolean;
  ip: string;
}

export class ChangeFanStatusDto {
  @IsBoolean()
  status: boolean;
  @IsString()
  ip: string;
  @IsString()
  gardenName: string;
  @IsOptional()
  @IsNumber()
  value?: number;
  static transform(arg: ChangeFanStatusDto): IChangeFanStatusDto {
    return {
      value: arg?.value,
      status: arg.status,
      ip: arg.ip,
    };
  }
}
