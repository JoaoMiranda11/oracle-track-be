import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ProductsService } from '../products/products.service';
import { TIMESTAMP_DAY_MS } from 'src/utils/dates';
import { UserPlanInfo } from './userplans.types';

@Injectable()
export class UserPlansService {
  constructor(
    private readonly userService: UserService,
    private readonly productsService: ProductsService,
  ) {}

  async updatePlan(userId: string, exchangePlanId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    const exchangePlan =
      await this.productsService.getOnePlanExchange(exchangePlanId);
    if (!exchangePlan)
      throw new HttpException('Exchange plan not found!', HttpStatus.NOT_FOUND);
    const plan = await this.productsService.getOnePlan(
      exchangePlan.destinationPlan as any,
    );
    if (!plan) throw new HttpException('Plan not found!', HttpStatus.NOT_FOUND);

    const now = new Date(Date.now());
    const currentStartDate = user?.plan?.startDate || now;
    const currentDueDate = user?.plan?.dueDate || now;
    return await this.userService.updateOne(userId, {
      $set: {
        plan: {
          planId: plan._id,
          startDate: currentStartDate,
          dueDate: new Date(
            currentDueDate.getTime() + TIMESTAMP_DAY_MS * plan.duration,
          ),
        },
      },
    });
  }

  async subscribePlan(userId: string, planId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    const plan = await this.productsService.getOnePlan(planId);
    if (!plan) throw new HttpException('Plan not found!', HttpStatus.NOT_FOUND);

    const now = new Date(Date.now());
    const currentStartDate = user?.plan?.startDate || now;
    const currentDueDate = user?.plan?.dueDate || now;
    await this.userService.updateOne(userId, {
      $set: {
        plan: {
          planId: plan._id,
          startDate: currentStartDate,
          dueDate: new Date(
            currentDueDate.getTime() + TIMESTAMP_DAY_MS * plan.duration,
          ),
        },
      },
    });
  }

  async removePlan(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    await this.userService.updateOne(userId, {
      $set: {
        plan: null,
      },
    });
  }

  async getPlanByUserId(userId: string): Promise<UserPlanInfo | null> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    const plan = await this.productsService.getOnePlan(
      user?.plan?.planId as any,
    );
    if (!plan) return null;
    return {
      dueDate: user.plan.dueDate,
      startDate: user.plan.startDate,
      plan: {
        planId: user.plan.planId as unknown as string,
        planCredits: plan.credits,
        description: plan.description,
        duration: plan.duration,
        name: plan.name,
        price: plan.price,
        tier: plan.tier,
      }
    };
  }

  async getUserPlanInfo(userId: string): Promise<null | UserPlanInfo> {
    const user = await this.userService.findOne(userId);
    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    const plan = await this.productsService.getOnePlan(
      user?.plan?.planId as any,
    );
    if (!plan) return null;

    return {
      dueDate: user.plan.dueDate,
      startDate: user.plan.startDate,
      plan: {
        planId: user.plan.planId as unknown as string,
        planCredits: plan.credits,
        description: plan.description,
        duration: plan.duration,
        name: plan.name,
        price: plan.price,
        tier: plan.tier,
      }
    };
  }
}
