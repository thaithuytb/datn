import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RepositoryModule } from '../../repositories/repository.module';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { verifyTokenMiddleware } from '../../middlewares/decoded-token';
import { AuthService } from '../auth/auth.service';
import { DaoModule } from '../../infrastructures/dao/dao.module';
import { PublicMqttService } from '../../mqtt/publish';

@Module({
  imports: [RepositoryModule, DaoModule],
  providers: [DeviceService, AuthService, PublicMqttService],
  controllers: [DeviceController],
})
export class DeviceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(verifyTokenMiddleware).forRoutes('api/v1/devices');
  }
}
