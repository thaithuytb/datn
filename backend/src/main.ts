import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { subcribeMqtt } from './mqtt/subcribe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  subcribeMqtt();
  await app.listen(7000);
}
bootstrap();
