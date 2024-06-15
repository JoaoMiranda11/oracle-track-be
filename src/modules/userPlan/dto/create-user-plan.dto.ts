  // TODO: pass to userplan
import { IsNotEmpty, IsString, IsNumber, IsDate, IsDateString } from 'class-validator';

export class CreateUserPlanDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  paymentId: string;

  @IsNotEmpty()
  @IsString()
  planId: string;

  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  dueDate: Date;
}
