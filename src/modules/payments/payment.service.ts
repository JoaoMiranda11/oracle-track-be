import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './entity/payment.schema';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { Model } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { v4 as uuidv4 } from 'uuid';
import {
  PaymentGateway,
  PaymentMethod,
  PaymentStatus,
  ProductType,
} from './payment.enum';
import { TIMESTAMP_DAY_MS } from 'src/utils/dates';

interface CreateGatewayOrder {
  method: PaymentMethod;
  value: number;
  installments: number;
  gateway: PaymentGateway;
}

interface CreatePaymentProps {
  recurring: boolean;
  productId: string;
  productType: ProductType;
  userId: string;
  discount: number;
  installments: number;
  description: string;
  method: PaymentMethod;
  gateway: PaymentGateway;
  value: number;
}
@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name, Connections.main)
    private paymentModel: Model<Payment>,
  ) {}

  private createGatewayOrder(paymentData: CreateGatewayOrder) {
    const id = uuidv4();
    return {
      paymentId: id,
      dueDate: new Date(Date.now() + TIMESTAMP_DAY_MS * 2),
      metadata: {},
      paymentGateway: paymentData.gateway,
      status:
        paymentData.method === PaymentMethod.CREDIT_CARD
          ? PaymentStatus.PAID
          : PaymentStatus.PENDING,
    };
  }

  async createPayment(paymentInfo: CreatePaymentProps) {
    await this.paymentModel.updateMany(
      {
        userId: paymentInfo.userId,
        productType: paymentInfo.productType,
        status: PaymentStatus.PENDING,
      },
      {
        $set: {
          status: PaymentStatus.CANCELED,
        },
      },
    );
    const gatewayInfo = this.createGatewayOrder(paymentInfo);
    return await this.paymentModel.create({ ...paymentInfo, ...gatewayInfo });
  }

  async getOnePayment(paymentId: string) {
    return await this.paymentModel.findById(paymentId);
  }

  async approvePayment(paymentId: string, metadata?: any) {
    const payment = await this.getOnePayment(paymentId);
    if (!payment)
      throw new HttpException('Payment not found!', HttpStatus.NOT_FOUND);
    if (payment.status !== PaymentStatus.PENDING) {
      throw new HttpException(
        `Invalid status: ${payment.status}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    await payment.updateOne({
      status: PaymentStatus.PAID,
      metadata,
    });
    return payment;
  }
}
