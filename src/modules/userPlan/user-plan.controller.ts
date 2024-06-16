import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserPlanService } from './user-plan.service';
import { AuthenticatedRequest } from '../auth/auth.types';
import { JwtAuthGuard } from 'src/guards/jwtAuth/jwt-auth.guard';
import { PurchasePlanDto } from './dto/purchase-plan.dto';
import { ApiKeyGuard } from 'src/guards/apiKey/apikey.guard';
import { ActivatePlanDto } from './dto/activate-plan.dto';

@Controller('userplan')
export class UserPlanController {
  constructor(private readonly userPlanService: UserPlanService) {}

  @UseGuards(JwtAuthGuard)
  @Get('status')
  async getUserPlanStatus(@Request() req: AuthenticatedRequest) {
    return await this.userPlanService.getUserPlanStatus(req.user._id as string);
  }

  @UseGuards(JwtAuthGuard)
  @Post('purchase')
  async purchasePlan(
    @Request() req: AuthenticatedRequest,
    @Body() purchasePlanDto: PurchasePlanDto,
  ) {
    return await this.userPlanService.purchasePlan(
      req.user.email,
      purchasePlanDto.planName,
    );
  }

  @UseGuards(ApiKeyGuard)
  @Post('activate')
  async activatePlan(@Body() approvePaymentDto: ActivatePlanDto) {
    this.userPlanService.activatePlan(approvePaymentDto.userPlanId);
  }
}
