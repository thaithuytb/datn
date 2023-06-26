import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RepositoryModule } from '../../repositories/repository.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { verifyTokenMiddleware } from '../../middlewares/decoded-token';

@Module({
  imports: [RepositoryModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(verifyTokenMiddleware).forRoutes('api/v1/auth/register');
    consumer
      .apply(verifyTokenMiddleware)
      .forRoutes('api/v1/auth/update-information');
    consumer.apply(verifyTokenMiddleware).forRoutes('api/v1/auth/verify-token');
    consumer.apply(verifyTokenMiddleware).forRoutes('api/v1/auth/users/*');
    consumer
      .apply(verifyTokenMiddleware)
      .forRoutes('api/v1/auth/upsert-gardens-on-users');
    consumer.apply(verifyTokenMiddleware).forRoutes('api/v1/auth/users');
  }
}
