import { Controller, Post, Body } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SendSmsDto } from './dto/sendSms.dto';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  async sendSMS(@Body() sendSmsDto: SendSmsDto) {
    const { phoneNumber, message } = sendSmsDto;
    
    try {
      await this.smsService.sendSMS(phoneNumber, message);
      return 'SMS sent successfully.';
    } catch (error) {
      return 'Failed to send SMS.';
    }
  }
}
