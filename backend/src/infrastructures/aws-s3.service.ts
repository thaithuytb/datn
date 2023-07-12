import { Injectable } from '@nestjs/common';
import {
  CreateBucketCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as dayjs from 'dayjs';
const IMAGE_MIME_TYPE = ['image/jpeg', 'image/png'];

@Injectable()
export class AwsS3Service {
  client: S3Client;
  constructor() {
    this.client = new S3Client({
      region: 'ap-northeast-1',
      credentials: {
        accessKeyId: 'AKIASMXT6WUPX2EAV4PP',
        secretAccessKey: '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',
      },
    });
  }
  async uploadImage(file: any) {
    console.log({ file });
    const isImage = IMAGE_MIME_TYPE.includes(file.mimetype);
    if (!isImage) {
      //TODO : Logger
      return {
        status: 500,
        error: 'File is not an image',
      };
    }
    const bucketParams = { Bucket: 'datn-thai-v1-29112001', ACL: 'private' };
    try {
      const data = await this.client.send(
        new CreateBucketCommand(bucketParams),
      );
      console.log('bucket created', data);
    } catch (err) {
      console.log('this bucket already exists', err);
    }

    const bucketName = 'datn-thai-v1-29112001';
    const fileType = file.originalname;
    const fileName =
      'image-' + dayjs(new Date()).format('YYYYMMDDHHmmssSSS-') + fileType;

    console.log({ bucketName, fileName });

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      // ACL: 'public-read', // comment if private file
    };
    const upload = new Upload({
      client: this.client,
      params: params,
    });
    upload.on('httpUploadProgress', (progress) => {
      console.log(progress);
    });
    await upload.done();

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });
    const signedUrl = await getSignedUrl(this.client, command, {
      expiresIn: 60 * 60,
    });
    return {
      path: signedUrl,
    };
  }
}
