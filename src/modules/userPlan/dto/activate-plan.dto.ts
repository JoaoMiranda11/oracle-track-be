import { IsNotEmpty, IsString } from 'class-validator';

export class ActivatePlanDto {
  @IsNotEmpty()
  @IsString()
  userPlanId: string;
}
