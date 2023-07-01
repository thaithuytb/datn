import { ThresholdNameEnum } from '@prisma/client';
import { IsArray, IsEnum } from 'class-validator';

export class ChangeThresholdDto {
  @IsArray()
  lowThreshold: number[];
  @IsArray()
  highThreshold: number[];
  @IsEnum(ThresholdNameEnum)
  name: ThresholdNameEnum;
}
