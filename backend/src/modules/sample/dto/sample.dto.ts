import { Optional } from '@nestjs/common';
import { IsBoolean, IsEnum, IsIn, IsNumber, IsString } from 'class-validator';

export class GetSampleByIdDto {
  @IsNumber()
  id: number;
}

export interface ICreateSampleDto {
  name: string;
  status: boolean;
}

export class CreateSampleDto {
  @IsString()
  name: string;
  @IsBoolean()
  status: boolean;
  static transform(arg: CreateSampleDto): ICreateSampleDto {
    return {
      name: arg.name,
      status: arg.status,
    };
  }
}

export class GetSamplesDto {
  @Optional()
  @IsString()
  name?: string;

  @Optional()
  @IsBoolean()
  status?: boolean;
}

export enum NumberType {
  TYPE_1 = 1,
  TYPE_2 = 2,
  TYPE_3 = 3,
}

export class CheckTypeSampleDto {
  @IsEnum(NumberType)
  // @IsIn([1, 2, 3])
  type: NumberType;
}
