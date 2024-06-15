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
import { TIMESTAMP_DAY_MS } from 'src/utils/dates';

interface Discount {
  flat: number;
  percentage: number;
}

@Injectable()
export class PaymentService {
  constructor(
    private readonly productService: ProductsService,
    private readonly userService: UserService,
    @InjectModel(Payment.name, Connections.main)
    private paymentModel: Model<Payment>,
  ) {}

  private async createPayment(payment: CreatePaymentDto) {
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

  // TODO: pass to userplan module
  async createPlan(
    email: string,
    planId: string,
    discount: Discount = {
      flat: 0,
      percentage: 0,
    },
  ) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const plan = await this.productService.getOnePlan(planId);
    if (!plan) throw new HttpException('Plan not found', HttpStatus.NOT_FOUND);
    const oldUserPlan = await this.productService.getUserPlan(
      user._id as string,
      true,
    );

    const isUpgrade = Boolean(oldUserPlan);
    const userPlanDates = {
      dueDate: new Date(Date.now() + plan.duration * TIMESTAMP_DAY_MS),
      startDate: new Date(Date.now()),
    };

    let upgradeDiscount = 0;
    if (isUpgrade) {
      if (oldUserPlan.planId === planId) {
        throw new HttpException('Plan already active', HttpStatus.CONFLICT);
      }
      const oldPlan = await this.productService.getOnePlan(oldUserPlan.planId);
      if (oldPlan) {
        userPlanDates.startDate = oldUserPlan.startDate;
        userPlanDates.dueDate = oldUserPlan.dueDate;
        upgradeDiscount = oldPlan.price;
      }
    }

    const amount = this.getAmmountWithDiscount(
      plan.price - upgradeDiscount,
      discount,
    );
    const payment = await this.createPayment({
      amount,
      itemId: plan._id as string,
      userId: user._id as string,
      status: PaymentStatus.Pending,
      itemType: ProductsEnum.Plan,
      paymentGateway: PaymentGateway.Boleto,
      paymentId: uuidv4(),
      details: isUpgrade ? 'upgrade' : 'subscription',
      discountFlat: upgradeDiscount + discount.flat,
      discountPercentage: discount.percentage,
    });

    await this.productService.createUserPlan({
      dueDate: userPlanDates.dueDate,
      paymentId: payment._id as string,
      startDate: userPlanDates.startDate,
      planId: planId,
      userId: user._id as string,
    });
  }
}
