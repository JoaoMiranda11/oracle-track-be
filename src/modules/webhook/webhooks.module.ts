import { WebhooksController } from './webhooks.controller';
import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { PaymentsModule } from '../payments/payments.module';
import { UserPlansModule } from '../userPlans/userPlans.module';
import { WebhooksService } from './webhooks.service';
import { WebsocketModule } from '../websocket/websocket.module';
import { CreditsModule } from '../credits/credits.module';

@Module({
  imports: [
    CreditsModule,
    ProductsModule,
    PaymentsModule,
    UserPlansModule,
    WebsocketModule,
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
