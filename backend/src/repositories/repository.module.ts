import { Module } from '@nestjs/common';
import { PrismaService } from '../infrastructures/prisma.service';
import { SampleRepository } from './sample.repository';
import { GardenRepository } from './garden.repository';
import { FanDataRepository } from './fan-data.repository';
import { AuthRepository } from './auth.repository';

@Module({
  providers: [
    PrismaService,
    SampleRepository,
    GardenRepository,
    FanDataRepository,
    AuthRepository,
  ],
  exports: [
    SampleRepository,
    GardenRepository,
    FanDataRepository,
    AuthRepository,
  ],
})
export class RepositoryModule {}
