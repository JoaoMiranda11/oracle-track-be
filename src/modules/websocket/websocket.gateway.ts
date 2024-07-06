import { JwtService } from '@nestjs/jwt';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsMessage } from './websocket.types';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    try {
      client.data.userId = client.handshake.query.userId as string;
      console.log(
        `Client connected: ${client.data.userId}\nwsId: ${client.id}`,
      );
    } catch (error) {
      console.error(error);
      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('notification')
  handleMessage(client: Socket, payload: any): string {
    console.log(payload);
    return 'Hello world!';
  }

  emitToUser(userId: string, ev: string, message: WsMessage) {
    const sockets = this.server.sockets.sockets;
    for (const socket of sockets) {
      const id = socket?.[0];
      const skt = socket?.[1];
      if (skt?.data?.userId === userId) {
        console.log(`[WS]: Notification to user: ${userId}\nwsId: ${id}`);
        skt.emit(ev, message);
        return;
      }
    }
    console.error('User not found');
    return;
  }

  emitToAll(ev: string, message: string) {
    this.server.emit(ev, message)
  }
}
