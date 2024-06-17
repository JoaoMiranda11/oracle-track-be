import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PaymentService } from '../payments/payment.service';
import { ProductsService } from '../products/products.service';
import { UserPlansService } from '../userPlans/userPlans.service';
import { PaymentStatus, ProductType } from '../payments/payment.enum';
import { Packages } from '../products/entity/packages.schema';
import { PackageEnum } from '../products/products.enum';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly userService: UserService,
    private readonly userPlanService: UserPlansService,
    private readonly paymentService: PaymentService,
    private readonly productsService: ProductsService,
  ) {}

  async approvePayment(paymentId: string, metadata: any) {
    const payment = await this.paymentService.approvePayment(paymentId);
    const userId = payment.userId as any;
    const productId = payment.productId as any;
    switch (payment.productType) {
      case ProductType.PLAN:
        const plan = await this.productsService.getOnePlan(productId)
        await this.userPlanService.subscribePlan(
          userId,
          productId,
        );
        await this.userService.addUserCredits(userId, plan.credits)
        break;
      case ProductType.PACKAGE:
        const pack = await this.productsService.getOnePackage(
          productId,
        );
        await this.userService.addUserCredits(userId, pack.credits)
        break;
      case ProductType.PLAN_UPGRADE:
        const planExchange = await this.productsService.getOnePlanExchange(productId)
        await this.userPlanService.updatePlan(
          userId,
          productId,
        );
        await this.userService.addUserCredits(userId, planExchange.credits)
        break;
    }

    await payment.updateOne({
      metadata,
      status: PaymentStatus.PAID,
    });
  }
}
