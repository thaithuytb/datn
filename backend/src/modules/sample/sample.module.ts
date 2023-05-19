import { Module } from '@nestjs/common';
import { SampleService } from './sample.service';
import { SampleController } from './sample.controller';
import { RepositoryModule } from '../../repositories/repository.module';
import { PublicMqttService } from '../../mqtt/publish';

@Module({
  imports: [RepositoryModule],
  providers: [SampleService, PublicMqttService],
  controllers: [SampleController],
})
export class SampleModule {}
