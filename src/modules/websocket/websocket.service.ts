import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WsMessage } from './websocket.types';

@Injectable()
export class WebsocketService {
  constructor(private readonly websocketGateway: WebsocketGateway) {}

  emitToUser(userId: string, ev: string, message: WsMessage) {
    this.websocketGateway.emitToUser(userId, ev, message);
  }
}
