import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwtAuth/jwt-auth.guard';
import { UserPlansService } from './userPlans.service';
import { AuthenticatedRequest } from '../auth/auth.types';

@Controller('userPlans')
export class UserPlansController {
  constructor(private readonly userPlanService: UserPlansService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/current')
  async getCurrentPlan(@Request() req: AuthenticatedRequest) {
    const planInfo = await this.userPlanService.getUserPlanInfo(req.user._id);
    if (!planInfo) return null;
    const res = {
      name: planInfo.plan.name,
      dueDate: planInfo.dueDate,
      startDate: planInfo.startDate,
      tier: planInfo.plan.tier,
    };
    return res;
  }

  @Get()
  async getAllPlans() {
    return await this.userPlanService.getAllPlans();
  }
}
