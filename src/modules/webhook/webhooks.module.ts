import { WebhooksController } from './webhooks.controller';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ProductsModule } from '../products/products.module';
import { PaymentsModule } from '../payments/payments.module';
import { UserPlansModule } from '../userPlans/userPlans.module';
import { WebhooksService } from './webhooks.service';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    UserModule,
    ProductsModule,
    PaymentsModule,
    UserPlansModule,
    WebsocketModule,
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
