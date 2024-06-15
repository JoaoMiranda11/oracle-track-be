import { IsNotEmpty, IsString, IsNumber, IsDate, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlanDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
