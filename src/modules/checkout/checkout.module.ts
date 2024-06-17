import { PaymentsModule } from '../payments/payments.module';
import { ProductsModule } from '../products/products.module';
import { UserPlansModule } from '../userPlans/userPlans.module';
import { CheckoutController } from './checkout.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [PaymentsModule, ProductsModule, UserPlansModule],
  controllers: [CheckoutController],
  providers: [],
})
export class CheckoutModule {}
