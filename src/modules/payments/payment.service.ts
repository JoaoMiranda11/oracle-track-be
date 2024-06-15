import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './entity/payment.schema';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { Model } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ProductsEnum } from '../products/products.enum';
import { PaymentGateway, PaymentStatus } from './payment.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentService {
  constructor(
    private readonly productService: ProductsService,
    private readonly userService: UserService,
    @InjectModel(Payment.name, Connections.main)
    private paymentModel: Model<Payment>,
  ) {}

  private async createPayment(payment: CreatePaymentDto) {
    this.paymentModel.create(payment);
  }

  async createPlan(email: string, planId: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const plan = await this.productService.getOnePlan(planId);
    if (!plan) throw new HttpException('Plan not found', HttpStatus.NOT_FOUND);

    await this.createPayment({
      amount: plan.price,
      itemId: plan._id as string,
      userId: user._id as string,
      status: PaymentStatus.Paid,
      itemType: ProductsEnum.Plan,
      paymentGateway: PaymentGateway.Boleto,
      paymentId: uuidv4()
    });
  }
}
