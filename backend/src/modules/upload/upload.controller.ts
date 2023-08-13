import {
  Controller,
  Post,
  Req,
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
  async uploadAvatar(@UploadedFile() fileImage, @Req() req: any): Promise<any> {
    const s3FilePath = await this.awsS3Service.uploadImage(fileImage);
    if (s3FilePath.path) {
      await this.uploadService.uploadService(s3FilePath.path, req.user.id);
    }
    console.log({ s3FilePath });
    return s3FilePath;
  }
}
