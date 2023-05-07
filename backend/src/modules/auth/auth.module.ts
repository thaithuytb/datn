import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from '../../infrastructures/prisma.service';
import { RepositoryModule } from '../../repositories/repository.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { verifyTokenMiddleware } from '../../middlewares/decoded-token';

@Module({
  imports: [RepositoryModule],
  providers: [PrismaService, AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(verifyTokenMiddleware).forRoutes('api/v1/auth/register');
  }
}
