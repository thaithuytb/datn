import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from '../../infrastructures/prisma.service';
import { RepositoryModule } from '../../repositories/repository.module';
import { PublicMqttService } from '../../mqtt/publish';
import { FanController } from './fan.controller';
import { FanService } from './fan.service';
import { verifyTokenMiddleware } from '../../middlewares/decoded-token';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [RepositoryModule],
  providers: [PrismaService, PublicMqttService, FanService, AuthService],
  controllers: [FanController],
})
export class FanModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(verifyTokenMiddleware).forRoutes('api/v1/*/actuators/fans');
  }
}
