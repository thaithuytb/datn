import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructures/dao/prisma.service';
import { Prisma, Sample } from '@prisma/client';
import { ISampleDomain } from '../domains/sample.domain';

@Injectable()
export class SampleRepository implements ISampleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getSampleById(id: number): Promise<Sample> {
    return this.prisma.sample.findFirstOrThrow({
      where: {
        id,
      },
    });
  }

  async getSamples(args: Prisma.SampleFindManyArgs): Promise<Sample[]> {
    return this.prisma.sample.findMany(args);
  }

  async createSample(sampleDomain: ISampleDomain): Promise<Sample> {
    return this.prisma.sample.create({
      data: sampleDomain.getSampleCreateInput(),
    });
  }
}

export interface ISampleRepository {
  getSampleById(id: number): Promise<Sample>;
  getSamples(args: Prisma.SampleFindManyArgs): Promise<Sample[]>;
  createSample(sampleDomain: ISampleDomain): Promise<Sample>;
}
