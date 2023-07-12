import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RepositoryModule } from '../../repositories/repository.module';
import { ThresholdService } from './threshold.service';
import { ThresholdController } from './threshold.controller';
import { verifyTokenMiddleware } from '../../middlewares/decoded-token';
import { AuthService } from '../auth/auth.service';
import { DaoModule } from '../../infrastructures/dao/dao.module';
import { PublicMqttService } from '../../mqtt/publish';

@Module({
  imports: [RepositoryModule, DaoModule],
  providers: [ThresholdService, AuthService, PublicMqttService],
  controllers: [ThresholdController],
})
export class ThresholdModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(verifyTokenMiddleware).forRoutes('api/v1/thresholds');
  }
}
