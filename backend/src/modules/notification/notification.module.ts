import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RepositoryModule } from '../../repositories/repository.module';
import { NotificationService } from './notification.service';
import { verifyTokenMiddleware } from '../../middlewares/decoded-token';
import { NotificationController } from './notification.controller';
import { AuthService } from '../auth/auth.service';
import { DaoModule } from '../../infrastructures/dao/dao.module';

@Module({
  imports: [RepositoryModule, DaoModule],
  providers: [NotificationService, AuthService],
  controllers: [NotificationController],
})
export class NotificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(verifyTokenMiddleware).forRoutes('api/v1/notifications');
  }
}
