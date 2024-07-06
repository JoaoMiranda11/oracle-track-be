import { MulterModule } from '@nestjs/platform-express';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';
import { Module } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { MongooseModule } from '@nestjs/mongoose';
import { SmsMessage, SmsMessageSchema } from './entity/smsMessage.schema';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { SmsBatch, SmsBatchSchema } from './entity/smsBatch.schema';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    WebsocketModule,
    MulterModule.register({
      storage: memoryStorage(),
    }),
    MongooseModule.forFeature(
      [{ name: SmsMessage.name, schema: SmsMessageSchema }],
      Connections.main,
    ),
    MongooseModule.forFeature(
      [{ name: SmsBatch.name, schema: SmsBatchSchema }],
      Connections.main,
    ),
  ],
  controllers: [SmsController],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
