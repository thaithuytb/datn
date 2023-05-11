import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from '../../infrastructures/prisma.service';
import { RepositoryModule } from '../../repositories/repository.module';
import { PublicMqttService } from '../../mqtt/publish';
import { FanDataController } from './fan-data.controller';
import { FanDataService } from './fan-data.service';
import { verifyTokenMiddleware } from '../../middlewares/decoded-token';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [RepositoryModule],
  providers: [PrismaService, PublicMqttService, FanDataService, AuthService],
  controllers: [FanDataController],
})
export class FanDataModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(verifyTokenMiddleware)
      .forRoutes('api/v1/*/data/actuators/fans');
  }
}
