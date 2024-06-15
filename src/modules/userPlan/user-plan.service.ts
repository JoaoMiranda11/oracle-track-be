import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { UserPlan } from './entity/userPlan.schema';
import { Plans } from '../products/entity/plans.schema';
import { CreateUserPlanDto } from './dto/create-user-plan.dto';
import { ProductsEnum } from '../products/products.enum';
import { v4 as uuidv4 } from 'uuid';
import { TIMESTAMP_DAY_MS } from 'src/utils/dates';
import { UserService } from '../user/user.service';
import { ProductsService } from '../products/products.service';
import { Discount } from '../payments/payment.types';
import { PaymentService } from '../payments/payment.service';
import { PaymentGateway, PaymentStatus } from '../payments/payment.enum';

@Injectable()
export class UserPlanService {
  constructor(
    private readonly productService: ProductsService,
    private readonly userService: UserService,
    private readonly paymentService: PaymentService,
    @InjectModel(UserPlan.name, Connections.main)
    private userPlanModel: Model<UserPlan>,
  ) {}

  async getLastUserPlan(userId: string, active?: boolean) {
    const now = new Date(Date.now());
    return await this.userPlanModel
      .findOne({
        userId,
        startDate: {
          $lte: now,
        },
        ...(active ? { dueDate: { $gte: now } } : {}),
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async createUserPlan(userPlan: CreateUserPlanDto) {
    return await this.userPlanModel.create(userPlan);
  }

  async purchase(
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
    const oldUserPlan = await this.getLastUserPlan(user._id as string, true);

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

    const amount = this.paymentService.getAmmountWithDiscount(
      plan.price - upgradeDiscount,
      discount,
    );
    const payment = await this.paymentService.createPayment({
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

    await this.createUserPlan({
      dueDate: userPlanDates.dueDate,
      paymentId: payment._id as string,
      startDate: userPlanDates.startDate,
      planId: planId,
      userId: user._id as string,
    });
  }
}
