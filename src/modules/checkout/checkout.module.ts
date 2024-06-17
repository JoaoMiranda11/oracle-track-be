import { PaymentsModule } from '../payments/payments.module';
import { ProductsModule } from '../products/products.module';
import { CheckoutController } from './checkout.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [PaymentsModule, ProductsModule],
  controllers: [CheckoutController],
  providers: [],
})
export class CheckoutModule {}
