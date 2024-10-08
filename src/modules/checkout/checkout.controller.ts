import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from '../payments/payment.service';
import { UserPlansService } from '../userPlans/userPlans.service';
import { JwtAuthGuard } from 'src/guards/jwtAuth/jwt-auth.guard';
import {
  CreatePlanPaymentDto,
  UpgradePlanDto,
} from '../payments/dto/create-payment.dto';
import { ProductType } from '../payments/payment.enum';
import { AuthenticatedRequest } from '../auth/auth.types';
import { ProductsService } from '../products/products.service';

@Controller('checkout')
export class CheckoutController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly productsService: ProductsService,
    private readonly userPlansService: UserPlansService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('subscribe/plan')
  async subscribePlan(
    @Request() req: AuthenticatedRequest,
    @Body() productDto: CreatePlanPaymentDto,
  ) {
    const userId = req.user._id as any;
    const planName = productDto.planName as any;
    const product = await this.productsService.getPlanByName(planName);
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    const currentPlan = await this.userPlansService.getPlanByUserId(userId);
    if (currentPlan?.plan?.name === product.name)
      throw new HttpException(
        'Plan already been subscribed',
        HttpStatus.BAD_REQUEST,
      );
    
    // TODO: discount logic
    const discount = productDto.discountToken;

    let paymentDto = {
      description: product.description,
      discount: 0,
      gateway: productDto.gateway,
      installments: productDto.installments,
      method: productDto.method,
      productId: product._id as unknown as string,
      productType: ProductType.PLAN,
      recurring: productDto.recurring,
      userId,
      value: product.price,
    };

    if (currentPlan) {
      const exchangePlan = await this.productsService.getPlanExchangeByPlansIds(
        currentPlan?.plan?.planId as unknown as string,
        product._id as unknown as string,
      );
      if (!exchangePlan)
        throw new HttpException(
          'Plan exchange not found!',
          HttpStatus.NOT_FOUND,
        );

      paymentDto = {
        description: product.description,
        discount: 0,
        gateway: productDto.gateway,
        installments: productDto.installments,
        method: productDto.method,
        productId: exchangePlan._id as unknown as string,
        productType: ProductType.PLAN_EXCHANGE,
        recurring: productDto.recurring,
        userId,
        value: exchangePlan.price,
      };
    }

    await this.paymentService.createPayment(paymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('purchase/package')
  async purchasePackage() {
    // TODO: this
    return true;
  }
}
