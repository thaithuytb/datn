import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateSampleDto,
  GetSampleByIdDto,
  GetSamplesDto,
} from './dto/sample.dto';
import { SampleRepository } from '../../repositories/sample.repository';
import { Samples } from './models/sample.model';
import { Prisma, Sample } from '@prisma/client';
import { SampleDomain } from '../../domains/sample.domain';
import { toHTTPStatusCodeFromPrisma } from 'src/common/error';

@Injectable()
export class SampleService {
  constructor(private readonly sampleRepository: SampleRepository) {}

  async getSampleById(dto: GetSampleByIdDto): Promise<Sample> {
    const result = await this.sampleRepository
      .getSampleById(dto.id)
      .catch((e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (toHTTPStatusCodeFromPrisma(e.code) === 404)
            throw new HttpException(
              `Not found with id=${dto.id}`,
              HttpStatus.NOT_FOUND,
            );
        }

        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      });

    return result;
  }

  async getSamples(dto: GetSamplesDto): Promise<Samples> {
    const condition: Prisma.SampleWhereInput = {
      ...dto,
      name: {
        contains: dto.name,
      },
    };
    const samples = await this.sampleRepository.getSamples({
      where: condition,
    });
    return {
      samples,
    };
  }

  async createSample(dto: CreateSampleDto): Promise<Sample> {
    //check validate here
    const sampleDomain = SampleDomain.registerSampleDomain(dto);
    sampleDomain.createSample();
    const sample = await this.sampleRepository.createSample(sampleDomain);
    return sample;
  }
}
