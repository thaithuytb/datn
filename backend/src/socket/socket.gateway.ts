import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'datn', cors: true })
export class SocketGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('joinGarden')
  handleJoinGarden(
    client: any,
    data: {
      gardenIds: number[];
    },
  ) {
    if (!data.gardenIds.length) {
      return;
    }
    data.gardenIds.forEach((id: number) => {
      this.server.socketsJoin(id.toString());
    });
  }

  emitToGarden(gardenId: string, eventName: string, eventData: any) {
    console.log('aaaaaaaa', gardenId, eventName, eventData);
    this.server.to(gardenId).emit(eventName, eventData);
  }
}
