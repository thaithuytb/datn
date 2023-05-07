import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from '../../infrastructures/prisma.service';
import { RepositoryModule } from '../../repositories/repository.module';
import { PublicMqttService } from '../../mqtt/publish';
import { GardenService } from './garden.service';
import { GardenController } from './garden.controller';
import { verifyTokenMiddleware } from '../../middlewares/decoded-token';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [RepositoryModule],
  providers: [GardenService, PrismaService, PublicMqttService, AuthService],
  controllers: [GardenController],
})
export class GardenModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(verifyTokenMiddleware).forRoutes('api/v1/gardens');
  }
}
