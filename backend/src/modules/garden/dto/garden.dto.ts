import { IsNumber, IsOptional } from 'class-validator';

export class GetGardensDto {
  @IsOptional()
  @IsNumber()
  userId?: number;
}
