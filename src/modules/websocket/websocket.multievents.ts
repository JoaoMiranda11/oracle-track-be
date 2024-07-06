import { WebsocketService } from './websocket.service';
import { WebsocketEventNames } from './websocket.enum';

export class WebsocketMultiEvents {
  readonly wss: WebsocketService;
  readonly userId: string;
  readonly ev: string;

  constructor(
    wss: WebsocketService,
    userId: string,
    event: WebsocketEventNames,
  ) {
    this.wss = wss;
    this.userId = userId;
    this.ev = event;
  }

  emit<T>(msg: string, metadata?: T) {
    this.wss.emitToUser(this.userId, this.ev, {
      metadata: metadata,
      msg: msg,
    });
  }
}
