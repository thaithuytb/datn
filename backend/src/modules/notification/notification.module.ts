import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RepositoryModule } from '../../repositories/repository.module';
import { PrismaService } from '../../infrastructures/prisma.service';
import { NotificationService } from './notification.service';
import { verifyTokenMiddleware } from '../../middlewares/decoded-token';
import { NotificationController } from './notification.controller';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [RepositoryModule],
  providers: [PrismaService, NotificationService, AuthService],
  controllers: [NotificationController],
})
export class NotificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(verifyTokenMiddleware).forRoutes('api/v1/notifications');
  }
}
