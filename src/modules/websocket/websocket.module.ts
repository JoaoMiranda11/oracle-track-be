import { Module } from '@nestjs/common';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { WebsocketService } from './websocket.service';

@Module({
  imports: [],
  controllers: [],
  providers: [WebsocketGateway, WebsocketService],
  exports: [WebsocketGateway, WebsocketService],
})
export class WebsocketModule {}
