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
import { CreatePaymentDto } from '../payments/dto/create-payment.dto';
import { ProductType } from '../payments/payment.enum';
import { AuthenticatedRequest } from '../auth/auth.types';
import { ProductsService } from '../products/products.service';

@Controller('checkout')
export class CheckoutController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly productsService: ProductsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('subscribe/plan')
  async subscribePlan(
    @Request() req: AuthenticatedRequest,
    @Body() payment: CreatePaymentDto,
  ) {
    const userId = req.user._id as any;
    const planName = payment.planName as any;
    const product = await this.productsService.getPlanByName(planName);
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    const discount = payment.discountToken;
    await this.paymentService.createPayment({
      description: product.description,
      discount: 0,
      gateway: payment.gateway,
      installments: payment.installments,
      method: payment.method,
      productId: product._id as unknown as string,
      productType: ProductType.PLAN,
      recurring: payment.recurring,
      userId,
      value: product.price,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('upgrade/plan')
  async upgradePlan(
    @Request() req: AuthenticatedRequest,
    @Body() payment: CreatePaymentDto,
  ) {
    const userId = req.user._id as any;
    const planName = payment.planName as any;
    const product = await this.productsService.getPlanByName(planName);
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);

    const discount = payment.discountToken;
    await this.paymentService.createPayment({
      description: product.description,
      discount: 0,
      gateway: payment.gateway,
      installments: payment.installments,
      method: payment.method,
      productId: product._id as unknown as string,
      productType: ProductType.PLAN_UPGRADE,
      recurring: payment.recurring,
      userId,
      value: product.price,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('purchase/package')
  async purchasePackage() {
    // TODO: this
    return true;
  }
}
