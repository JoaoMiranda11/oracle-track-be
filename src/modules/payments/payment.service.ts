import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './entity/payment.schema';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { Model } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Discount } from './payment.types';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name, Connections.main)
    private paymentModel: Model<Payment>,
  ) {}

  async createPayment(payment: CreatePaymentDto) {
    return this.paymentModel.create(payment);
  }

  discountPercentageToFraction(percentage: number) {
    return parseFloat(percentage.toFixed(2)) / 100;
  }

  getAmmountWithDiscount(amount: number, discount: Discount) {
    let result = amount;
    result -= this.discountPercentageToFraction(discount.percentage) * amount;
    result -= discount.flat;
    return result;
  }
}
