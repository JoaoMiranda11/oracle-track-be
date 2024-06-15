import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './entity/payment.schema';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    ProductsModule,
    UserModule,
    MongooseModule.forFeature(
      [{ name: Payment.name, schema: PaymentSchema }],
      Connections.main,
    ),
  ],
  controllers: [],
  providers: [PaymentService],
  exports: [PaymentService]
})
export class PaymentsModule {}
