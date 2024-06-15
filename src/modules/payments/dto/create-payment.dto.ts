import { IsMongoId, IsEnum, IsNumber, IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductsEnum } from 'src/modules/products/products.enum';
import { PaymentGateway, PaymentStatus } from '../payment.enum';

export class CreatePaymentDto {
  @IsMongoId()
  readonly userId: string;

  @IsMongoId()
  readonly itemId: string;

  @IsEnum(ProductsEnum)
  readonly itemType: ProductsEnum;

  @IsNumber()
  readonly amount: number;

  @IsEnum(PaymentStatus)
  readonly status: PaymentStatus;

  @IsEnum(PaymentGateway)
  readonly paymentGateway: PaymentGateway;

  @IsString()
  readonly paymentId: string;
}
