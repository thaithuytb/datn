import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SampleModule } from './modules/sample/sample.module';
import { RepositoryModule } from './repositories/repository.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { FanDataModule } from './modules/fan-data/fan-data.module';
import { GardenModule } from './modules/garden/garden.module';
import { SocketModule } from './socket/socket.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotificationModule } from './modules/notification/notification.module';
import { DeviceModule } from './modules/device/device.module';
import { UploadModule } from './modules/upload/upload.module';
import { ThresholdModule } from './modules/threshold/threshold.module';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.CACHE_PORT
          ? parseInt(process.env.CACHE_PORT, 10)
          : 6998,
      },
    }),
    RepositoryModule,
    SampleModule,
    FanDataModule,
    GardenModule,
    SocketModule,
    AuthModule,
    NotificationModule,
    DeviceModule,
    UploadModule,
    ThresholdModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
