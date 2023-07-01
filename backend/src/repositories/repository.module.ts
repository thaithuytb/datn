import { Module } from '@nestjs/common';
import { SampleRepository } from './sample.repository';
import { GardenRepository } from './garden.repository';
import { FanDataRepository } from './fan-data.repository';
import { AuthRepository } from './auth.repository';
import { NotificationRepository } from './notification.repository';
import { DaoModule } from '../infrastructures/dao/dao.module';
import { DeviceRepository } from './device.repository';
import { ThresholdRepository } from './threshold.repository';

@Module({
  imports: [DaoModule],
  providers: [
    SampleRepository,
    GardenRepository,
    FanDataRepository,
    AuthRepository,
    NotificationRepository,
    DeviceRepository,
    ThresholdRepository,
  ],
  exports: [
    SampleRepository,
    GardenRepository,
    FanDataRepository,
    AuthRepository,
    NotificationRepository,
    DeviceRepository,
    ThresholdRepository,
  ],
})
export class RepositoryModule {}
