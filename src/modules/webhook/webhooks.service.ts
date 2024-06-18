import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PaymentService } from '../payments/payment.service';
import { ProductsService } from '../products/products.service';
import { UserPlansService } from '../userPlans/userPlans.service';
import { PaymentStatus, ProductType } from '../payments/payment.enum';
import { WebsocketService } from '../websocket/websocket.service';

@Injectable()
export class WebhooksService {
  constructor(
    private readonly userService: UserService,
    private readonly userPlanService: UserPlansService,
    private readonly paymentService: PaymentService,
    private readonly productsService: ProductsService,
    private readonly websocketService: WebsocketService,
  ) {}

  async approvePayment(paymentId: string, metadata: any) {
    const payment = await this.paymentService.approvePayment(paymentId);
    const userId = payment.userId as any;
    const productId = payment.productId as any;

    let notificationName: string;
    switch (payment.productType) {
      case ProductType.PLAN:
        notificationName = 'payment_plan';
        const plan = await this.productsService.getOnePlan(productId);
        await this.userPlanService.subscribePlan(userId, productId);
        await this.userService.addUserCredits(userId, plan.credits);
        break;
      case ProductType.PACKAGE:
        notificationName = 'payment_package';
        const pack = await this.productsService.getOnePackage(productId);
        await this.userService.addUserCredits(userId, pack.credits);
        break;
      case ProductType.PLAN_EXCHANGE:
        notificationName = 'payment_plan';
        const planExchange =
          await this.productsService.getOnePlanExchange(productId);
        await this.userPlanService.updatePlan(userId, productId);
        await this.userService.addUserCredits(userId, planExchange.credits);
        break;
    }

    await payment.updateOne({
      metadata,
      status: PaymentStatus.PAID,
    });

    if (notificationName)
      this.websocketService.emitToUser(
        userId,
        notificationName,
        PaymentStatus.PAID,
      );
  }
}
