import {
  IsMongoId,
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';
import { ProductsEnum } from 'src/modules/products/products.enum';
import { PaymentGateway, PaymentStatus } from '../payment.enum';

export class CreateProviderPaymentDto {
  @IsMongoId()
  readonly userId: string;

  @IsNumber()
  readonly totalAmount: number;

  @IsEnum(ProductsEnum)
  readonly itemType: ProductsEnum;

  @IsEnum(PaymentStatus)
  readonly status: PaymentStatus;

  @IsEnum(PaymentGateway)
  readonly paymentGateway: PaymentGateway;

  @IsString()
  @IsOptional()
  readonly details?: string;
}
