import {
  IsMongoId,
  IsEnum,
  IsNumber,
  IsDate,
  IsString,
  IsOptional,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { PaymentGateway, PaymentMethod, PaymentStatus, ProductType } from '../payment.enum';

export class CreatePlanPaymentDto {
  @IsNotEmpty()
  recurring: boolean;

  @IsNotEmpty()
  @IsMongoId()
  planName: string;

  @IsEnum(PaymentGateway)
  gateway: PaymentGateway;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsNumber()
  @Min(1)
  installments: number;

  @IsString()
  @IsOptional()
  discountToken?: string;
}

export class UpgradePlanDto {
  @IsNotEmpty()
  recurring: boolean;

  @IsNotEmpty()
  @IsMongoId()
  exchangePlanName: string;

  @IsEnum(PaymentGateway)
  gateway: PaymentGateway;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsNumber()
  @Min(1)
  installments: number;

  @IsString()
  @IsOptional()
  discountToken?: string;
}

export class PaymentDto extends CreatePlanPaymentDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;
}