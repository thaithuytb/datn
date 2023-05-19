import { Module } from '@nestjs/common';
import { PrismaService } from '../infrastructures/dao/prisma.service';
import { SampleRepository } from './sample.repository';
import { GardenRepository } from './garden.repository';
import { FanDataRepository } from './fan-data.repository';
import { AuthRepository } from './auth.repository';
import { NotificationRepository } from './notification.repository';
import { DaoModule } from '../infrastructures/dao/dao.module';

@Module({
  imports: [DaoModule],
  providers: [
    SampleRepository,
    GardenRepository,
    FanDataRepository,
    AuthRepository,
    NotificationRepository,
  ],
  exports: [
    SampleRepository,
    GardenRepository,
    FanDataRepository,
    AuthRepository,
    NotificationRepository,
  ],
})
export class RepositoryModule {}
