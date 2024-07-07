import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwtAuth/jwt-auth.guard';
import { RequestUser } from 'src/decorators/requestUser.decorator';
import { JwtUserInfo } from '../auth/auth.types';
import { CreditsService } from './credits.service';
import { SmsService } from '../sms/sms.service';
import { TIMESTAMP_DAY_MS } from 'src/utils/dates';

@Controller('credits')
export class CreditsController {
  constructor(
    private readonly creditsService: CreditsService,
    private readonly smsService: SmsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('batches')
  async getTransactions(@RequestUser() req: JwtUserInfo) {
    const date = new Date(Date.now() - TIMESTAMP_DAY_MS * 30);
    const res = await this.smsService.getBatches(req._id, {
      filter: {
        createdAt: {
          $gte: date,
        },
      },
      limit: 100,
      projection: {
        ammount: 1,
        createdAt: 1,
      },
    });
    return res.map((data) => ({
      createdAt: data.createdAt,
      ammount: data.ammount,
      name: 'SMS',
    }));
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCredits(@RequestUser() req: JwtUserInfo) {
    return await this.creditsService.getCredits(req._id);
  }
}
