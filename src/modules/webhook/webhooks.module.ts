import { WebhooksController } from './webhooks.controller';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ProductsModule } from '../products/products.module';
import { PaymentsModule } from '../payments/payments.module';
import { UserPlansModule } from '../userPlans/userPlans.module';
import { WebhooksService } from './webhooks.service';

@Module({
  imports: [UserModule, ProductsModule, PaymentsModule, UserPlansModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
