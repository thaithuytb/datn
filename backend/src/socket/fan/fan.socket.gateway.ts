import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'fan', cors: true })
export class FanGateway {
  @WebSocketServer() server: Server;

  findAll() {
    console.log('a');
  }
}
