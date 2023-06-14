import { RoleGarden } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class UpsertGardensOnUsers {
  @IsNumber()
  gardenId: number;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsEnum(RoleGarden)
  role?: RoleGarden;
}
