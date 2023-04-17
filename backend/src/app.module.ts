import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SampleModule } from './modules/sample/sample.module';
import { RepositoryModule } from './repositories/repository.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { FanModule } from './modules/fan/fan.module';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.CACHE_PORT
          ? parseInt(process.env.CACHE_PORT, 10)
          : 6998,
      },
    }),
    RepositoryModule,
    SampleModule,
    FanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
