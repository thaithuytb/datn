import { Module } from '@nestjs/common';
import { PrismaService } from '../../infrastructures/prisma.service';
import { RepositoryModule } from '../../repositories/repository.module';
import { PublicMqttService } from '../../mqtt/publish';
import { FanController } from './fan.controller';
import { FanService } from './fan.service';

@Module({
  imports: [RepositoryModule],
  providers: [PrismaService, PublicMqttService, FanService],
  controllers: [FanController],
})
export class FanModule {}
