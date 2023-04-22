import { Module } from '@nestjs/common';
import { FanGateway } from './fan.socket.gateway';

@Module({
  providers: [FanGateway],
  exports: [FanGateway],
})
export class FanSocketModule {}
