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

  private async applyPack(userId: string, pack: Packages) {
    switch (pack.type) {
      case PackageEnum.CREDITS:
        await this.userService.updateUserCredits(userId, pack.quantity);
    }
  }

  async approvePayment(paymentId: string, metadata: any) {
    const payment = await this.paymentService.approvePayment(paymentId);
    switch (payment.productType) {
      case ProductType.PLAN:
        await this.userPlanService.subscribePlan(
          payment.userId as any,
          payment.productId as any,
        );
        break;
      case ProductType.PACKAGE:
        const pack = await this.productsService.getOnePackage(
          payment.productId as any,
        );
        await this.applyPack(payment.userId as any, pack);
        break;
      case ProductType.PLAN_UPGRADE:
        await this.userPlanService.updatePlan(
          payment.userId as any,
          payment.productId as any,
        );
        break;
    }

    await payment.updateOne({
      metadata,
      status: PaymentStatus.PAID,
    });
  }
}
