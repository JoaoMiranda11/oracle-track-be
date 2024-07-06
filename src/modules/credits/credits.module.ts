import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { CreditsService } from './credits.service';
import { CreditsController } from './credits.controller';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [UserModule, WebsocketModule],
  controllers: [CreditsController],
  providers: [CreditsService],
  exports: [CreditsService],
})
export class CreditsModule {}
