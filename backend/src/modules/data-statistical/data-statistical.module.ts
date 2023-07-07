import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RepositoryModule } from '../../repositories/repository.module';
import { PublicMqttService } from '../../mqtt/publish';
import { DataStatisticalController } from './data-statistical.controller';
import { DataStatisticalService } from './data-statistical.service';
import { verifyTokenMiddleware } from '../../middlewares/decoded-token';
import { AuthService } from '../auth/auth.service';
import { GardenService } from '../garden/garden.service';

@Module({
  imports: [RepositoryModule],
  providers: [
    PublicMqttService,
    DataStatisticalService,
    AuthService,
    GardenService,
  ],
  controllers: [DataStatisticalController],
})
export class DataStatisticalModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(verifyTokenMiddleware).forRoutes('api/v1/data-statistical');
  }
}
