import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SampleModule } from './modules/sample/sample.module';
import { RepositoryModule } from './repositories/repository.module';

@Module({
  imports: [SampleModule, RepositoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
