import {
  CreateSampleDto,
  ICreateSampleDto,
} from '../modules/sample/dto/sample.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

export class SampleDomain implements ISampleDomain {
  constructor(private dto: CreateSampleDto) {}
  private isCreateSampleDto(arg: unknown): arg is CreateSampleDto {
    return (
      typeof arg === 'object' &&
      arg !== null &&
      typeof (arg as CreateSampleDto).name === 'string' &&
      typeof (arg as CreateSampleDto).status === 'boolean'
    );
  }
  createSample(): SampleDomain {
    if (!this.isCreateSampleDto(this.dto)) {
      throw new HttpException(
        'this sample have not been persisted.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this;
  }

  getSampleCreateInput(): ICreateSampleDto {
    if (!this.isCreateSampleDto(this.dto)) {
      throw new HttpException(
        'this sample have not been persisted.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return CreateSampleDto.transform(this.dto);
  }

  static registerSampleDomain(dto: CreateSampleDto) {
    return new SampleDomain(dto);
  }
}

export interface ISampleDomain {
  createSample(): SampleDomain;
  getSampleCreateInput(): ICreateSampleDto;
}
