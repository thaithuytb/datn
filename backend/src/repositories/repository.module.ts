import { Module } from '@nestjs/common';
import { SampleRepository } from './sample.repository';
import { GardenRepository } from './garden.repository';
import { AuthRepository } from './auth.repository';
import { NotificationRepository } from './notification.repository';
import { DaoModule } from '../infrastructures/dao/dao.module';
import { DeviceRepository } from './device.repository';
import { ThresholdRepository } from './threshold.repository';
import { DataStatisticalRepository } from './data.repository';

@Module({
  imports: [DaoModule],
  providers: [
    SampleRepository,
    GardenRepository,
    AuthRepository,
    NotificationRepository,
    DeviceRepository,
    ThresholdRepository,
    DataStatisticalRepository,
  ],
  exports: [
    SampleRepository,
    GardenRepository,
    AuthRepository,
    NotificationRepository,
    DeviceRepository,
    ThresholdRepository,
    DataStatisticalRepository,
  ],
})
export class RepositoryModule {}
