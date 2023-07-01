import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from '../../infrastructures/aws-s3.service';

@Controller('api/v1/upload')
export class UploadController {
  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly uploadService: UploadService,
  ) {}
  @Post('/avatar')
  @UseInterceptors(FileInterceptor('fileImage'))
  async uploadAvatar(@UploadedFile() fileImage): Promise<any> {
    const s3FilePath = await this.awsS3Service.uploadImage(fileImage);
    console.log({ s3FilePath });
    return s3FilePath;
  }
}
