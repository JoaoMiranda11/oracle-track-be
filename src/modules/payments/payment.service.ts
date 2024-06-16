import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './entity/payment.schema';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { Model } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Discount } from './payment.types';
import { CreateProviderPaymentDto } from './dto/create-provider-payment.dto';
import { v4 as uuidv4 } from 'uuid';
import { PaymentStatus } from './payment.enum';
@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name, Connections.main)
    private paymentModel: Model<Payment>,
  ) {}

  async createProviderPayment(payment: CreateProviderPaymentDto) {
    // TODO: use providers
    return {
      id: uuidv4(),
    };
  }

  async createPayment(payment: CreatePaymentDto) {
    return this.paymentModel.create(payment);
  }

  async getOnePayment(paymentId: string) {
    return await this.paymentModel.findById(paymentId);
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

  async approvePayment(paymentId: string) {
    const payment = await this.getOnePayment(paymentId);
    if (!payment)
      throw new HttpException('Payment not found!', HttpStatus.NOT_FOUND);
    await payment.updateOne({
      status: PaymentStatus.Paid,
    });
  }
}
