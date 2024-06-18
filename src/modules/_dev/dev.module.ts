import { Module } from '@nestjs/common';
import { DevController } from './dev.controller';
import { SmsModule } from '../sms/sms.module';
import { MailModule } from '../mail/mail.module';
import { ProductsModule } from '../products/products.module';
import { PaymentsModule } from '../payments/payments.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    SmsModule,
    MailModule,
    ProductsModule,
    PaymentsModule,
    WebsocketModule,
  ],
  controllers: [DevController],
  providers: [],
})
export class DevModule {}
