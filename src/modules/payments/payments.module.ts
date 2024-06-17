import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './entity/payment.schema';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Payment.name, schema: PaymentSchema }],
      Connections.main,
    ),
  ],
  controllers: [],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentsModule {}
