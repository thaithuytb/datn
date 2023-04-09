import { Module } from '@nestjs/common';
import { SampleService } from './sample.service';
import { SampleController } from './sample.controller';
import { PrismaService } from '../../infrastructures/prisma.service';
import { RepositoryModule } from '../../repositories/repository.module';

@Module({
  imports: [RepositoryModule],
  providers: [SampleService, PrismaService],
  controllers: [SampleController],
})
export class SampleModule {}
