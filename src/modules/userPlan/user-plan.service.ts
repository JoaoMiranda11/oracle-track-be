import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { UserPlan } from './entity/userPlan.schema';
import { CreateUserPlanDto } from './dto/create-user-plan.dto';
import { ProductsEnum } from '../products/products.enum';
import { TIMESTAMP_DAY_MS } from 'src/utils/dates';
import { UserService } from '../user/user.service';
import { ProductsService } from '../products/products.service';
import { Discount } from '../payments/payment.types';
import { PaymentService } from '../payments/payment.service';
import { PaymentGateway, PaymentStatus } from '../payments/payment.enum';
import { Plans } from '../products/entity/plans.schema';

@Injectable()
export class UserPlanService {
  constructor(
    private readonly productService: ProductsService,
    private readonly userService: UserService,
    private readonly paymentService: PaymentService,
    @InjectModel(UserPlan.name, Connections.main)
    private userPlanModel: Model<UserPlan>,
  ) {}

  private generateUserPlanDates(plan: Plans) {
    return {
      dueDate: new Date(Date.now() + plan.duration * TIMESTAMP_DAY_MS),
      startDate: new Date(Date.now()),
    };
  }

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

  async getUserPlanStatus(userId: string, active = true) {
    const userPlan = await this.getLastUserPlan(userId, active);
    if (!userPlan?.planId || !userPlan?.paymentId) return null;
    const plan = await this.productService.getOnePlan(userPlan.planId);
    const payment = await this.paymentService.getOnePayment(userPlan.paymentId);

    return {
      name: plan.name,
      dueDate: userPlan.dueDate,
      startDate: userPlan.startDate,
      active: payment.status === PaymentStatus.Paid,
    };
  }

  async createUserPlan(userPlan: CreateUserPlanDto) {
    return await this.userPlanModel.create(userPlan);
  }

  async activatePlan(userPlanId: string) {
    const userPlan = await this.userPlanModel.findById(userPlanId);
    if (!userPlan)
      throw new HttpException('Userplan not found!', HttpStatus.NOT_FOUND);
    await this.paymentService.approvePayment(userPlan.paymentId);
    const plan = await this.productService.getOnePlan(userPlan.planId);
    if (!plan) {
      throw new HttpException('Plan not found!', HttpStatus.NOT_FOUND);
    }

    const userPlanDates = this.generateUserPlanDates(plan);
    userPlan.updateOne({
      dueDate: userPlanDates.dueDate,
      startDate: userPlanDates.startDate,
    });
    await this.userService.updateUserCredits(userPlan.userId, plan.credits);
  }

  async purchasePlan(
    email: string,
    planName: string,
    // TODO: transform to collection discounts
    discount: Discount = {
      flat: 0,
      percentage: 0,
    },
  ) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const plan = await this.productService.getPlanByName(planName);
    if (!plan) throw new HttpException('Plan not found', HttpStatus.NOT_FOUND);
    const oldUserPlan = await this.getLastUserPlan(user._id as string, true);

    const isUpgrade = Boolean(oldUserPlan);
    const userPlanDates = this.generateUserPlanDates(plan);

    let upgradeDiscount = 0;
    if (isUpgrade) {
      if (oldUserPlan.planId === plan._id) {
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
    const paymentDetails = isUpgrade ? 'upgrade' : 'subscription';
    const paymentProvider = await this.paymentService.createProviderPayment({
      status: PaymentStatus.Pending,
      itemType: ProductsEnum.Plan,
      paymentGateway: PaymentGateway.Manual,
      totalAmount: amount,
      userId: user._id as string,
      details: paymentDetails,
    });
    const payment = await this.paymentService.createPayment({
      amount,
      itemId: plan._id as string,
      userId: user._id as string,
      status: PaymentStatus.Pending,
      itemType: ProductsEnum.Plan,
      paymentGateway: PaymentGateway.Manual, // TODO: create methods
      paymentId: paymentProvider.id,
      details: isUpgrade ? 'upgrade' : 'subscription',
      discountFlat: upgradeDiscount + discount.flat,
      discountPercentage: discount.percentage,
    });

    await this.createUserPlan({
      dueDate: userPlanDates.dueDate,
      startDate: userPlanDates.startDate,
      paymentId: payment._id as string,
      planId: plan._id as string,
      userId: user._id as string,
    });
  }
}
