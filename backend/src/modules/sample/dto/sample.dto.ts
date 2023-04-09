import { Optional } from '@nestjs/common';
import {
  IsBoolean,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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
