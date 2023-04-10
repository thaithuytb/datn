import { Module } from '@nestjs/common';
import { SampleService } from './sample.service';
import { SampleController } from './sample.controller';
import { PrismaService } from '../../infrastructures/prisma.service';
import { RepositoryModule } from '../../repositories/repository.module';
import { PublicMqttService } from '../../mqtt/publish';

@Module({
  imports: [RepositoryModule],
  providers: [SampleService, PrismaService, PublicMqttService],
  controllers: [SampleController],
})
export class SampleModule {}
