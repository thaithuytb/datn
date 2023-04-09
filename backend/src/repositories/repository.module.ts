import { Module } from '@nestjs/common';
import { PrismaService } from '../infrastructures/prisma.service';
import { SampleRepository } from './sample.repository';

@Module({
  providers: [PrismaService, SampleRepository],
  exports: [SampleRepository],
})
export class RepositoryModule {}
