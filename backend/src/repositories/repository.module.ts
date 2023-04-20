import { Module } from '@nestjs/common';
import { PrismaService } from '../infrastructures/prisma.service';
import { SampleRepository } from './sample.repository';
import { GardenRepository } from './garden.repository';

@Module({
  providers: [PrismaService, SampleRepository, GardenRepository],
  exports: [SampleRepository, GardenRepository],
})
export class RepositoryModule {}
