import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetGardensDto {
  @IsOptional()
  @IsNumber()
  userId?: number;
}

export class ChangeStatusGardenDto {
  @IsBoolean()
  isAuto: boolean;
  @IsString()
  time?: string;
}
