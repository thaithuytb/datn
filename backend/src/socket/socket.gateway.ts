import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'device', cors: true })
export class SocketGateway {
  @WebSocketServer() server: Server;
}
