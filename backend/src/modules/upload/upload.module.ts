import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RepositoryModule } from '../../repositories/repository.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { verifyTokenMiddleware } from '../../middlewares/decoded-token';
import { AuthService } from '../auth/auth.service';
import { AwsS3Service } from '../../infrastructures/aws-s3.service';

@Module({
  imports: [RepositoryModule],
  providers: [UploadService, AuthService, AwsS3Service],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(verifyTokenMiddleware).forRoutes('api/v1/upload/avatar');
  }
}
