import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwtAuth/jwt-auth.guard';
import { RequestUser } from 'src/decorators/requestUser.decorator';
import { JwtUserInfo } from '../auth/auth.types';
import { CreditsService } from './credits.service';

@Controller('credits')
export class CreditsController {
  constructor(
    private readonly creditsService: CreditsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCredits(@RequestUser() req: JwtUserInfo) {
    return await this.creditsService.getCredits(req._id);
  }
}
