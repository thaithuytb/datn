import { Module } from '@nestjs/common';
import { PrismaService } from '../../infrastructures/prisma.service';
import { RepositoryModule } from '../../repositories/repository.module';
import { PublicMqttService } from '../../mqtt/publish';
import { GardenService } from './garden.service';
import { GardenController } from './garden.controller';

@Module({
  imports: [RepositoryModule],
  providers: [GardenService, PrismaService, PublicMqttService],
  controllers: [GardenController],
})
export class GardenModule {}
