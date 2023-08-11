import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class GetGardensDto {
  @IsOptional()
  @IsNumber()
  userId?: number;
}

export class ChangeStatusGardenDto {
  @IsBoolean()
  isAuto: boolean;
  @IsOptional()
  @IsString()
  time?: string;
}

export class CreateGardenDto {
  @IsString()
  name: string;
  @IsString()
  address: string;
  @IsOptional()
  @IsNumber()
  width?: number;
  @IsOptional()
  @IsNumber()
  length?: number;
  @IsOptional()
  @IsNumber()
  hight?: number;
  @IsNumber()
  landArea: number;
  static transform(arg: CreateGardenDto): ICreateGardenDto {
    return {
      name: arg.name,
      address: arg.address,
      landArea: arg.landArea,
      width: arg.width,
      hight: arg.hight,
      length: arg.length,
    };
  }
}

export class UpdateGardenDto extends PartialType(CreateGardenDto) {
  @IsNumber()
  id: number;
  static transform(arg: UpdateGardenDto): Partial<ICreateGardenDto> {
    return {
      name: arg.name,
      address: arg.address,
      landArea: arg.landArea,
      width: arg.width,
      hight: arg.hight,
      length: arg.length,
    };
  }
}

export interface ICreateGardenDto {
  name: string;
  address: string;
  width?: number;
  length?: number;
  hight?: number;
  landArea: number;
}
