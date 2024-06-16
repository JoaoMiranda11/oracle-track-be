import { IsNotEmpty, IsString } from 'class-validator';

export class PurchasePlanDto {
  @IsNotEmpty()
  @IsString()
  planName: string;
}
