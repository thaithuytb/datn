import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { subscribeMqtt } from './mqtt/subscribe';
import { ValidationPipe } from '@nestjs/common';
import { FanGateway } from './socket/fan/fan.socket.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(process.env.PORT || 7000);
  
  const fanGateway = app.get(FanGateway);
  await subscribeMqtt(fanGateway);
}
bootstrap();
