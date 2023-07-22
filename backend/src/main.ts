import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { subscribeMqtt } from './mqtt/subscribe';
import { ValidationPipe } from '@nestjs/common';
import { SocketGateway } from './socket/socket.gateway';
import { NotificationService } from './modules/notification/notification.service';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { LogService } from './infrastructures/log/log.service';
// import { AllExceptionFilter } from './exceptions/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggerInterceptor(new LogService()));
  // app.useGlobalFilters(new AllExceptionFilter(new LogService()));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(process.env.PORT || 7000);

  const socketGateway = app.get(SocketGateway);
  const notificationService = app.get(NotificationService);
  await subscribeMqtt(socketGateway, notificationService);
}
bootstrap();
