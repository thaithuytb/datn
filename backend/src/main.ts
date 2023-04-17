import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { subscribeMqtt } from './mqtt/subscribe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await subscribeMqtt();
  await app.listen(7000);
}
bootstrap();
