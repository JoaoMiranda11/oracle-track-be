import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwtAuth/jwt-auth.guard';
import { UserPlansService } from './userPlans.service';
import { AuthenticatedRequest } from '../auth/auth.types';

@Controller('userPlans')
export class UserPlansController {
  constructor(private readonly userPlanService: UserPlansService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPlan(@Request() req: AuthenticatedRequest) {
    const planInfo = await this.userPlanService.getUserPlanInfo(req.user._id);
    return planInfo;
  }
}
