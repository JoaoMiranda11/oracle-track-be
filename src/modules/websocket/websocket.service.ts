import { Injectable } from "@nestjs/common";
import { WebsocketGateway } from "./websocket.gateway";

@Injectable()
export class WebsocketService {
  constructor(private readonly websocketGateway: WebsocketGateway) {}

  emitToUser(userId: string, ev: string, message: any) {
    this.websocketGateway.emitToUser(userId, ev, message)
  }
}
