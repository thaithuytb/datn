import { Module } from '@nestjs/common';
import { PrismaService } from '../infrastructures/prisma.service';
import { SampleRepository } from './sample.repository';
import { GardenRepository } from './garden.repository';
import { FanRepository } from './fan.repository';

@Module({
  providers: [PrismaService, SampleRepository, GardenRepository, FanRepository],
  exports: [SampleRepository, GardenRepository, FanRepository],
})
export class RepositoryModule {}
