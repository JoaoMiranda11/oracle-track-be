import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SmsService } from './sms.service';
import { cleanupPhoneNumbers } from 'src/utils/sanetizations';
import { SendSmsDto } from './dto/sendSms.dto';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Body() body: SendSmsDto) {
    const data = await this.smsService.processCSV(file);
    const { invalid, valid } = cleanupPhoneNumbers(data);
    const phones = valid.map((message) => message.phone);
    await this.smsService.sendMany(body.message, phones);

    return { invalid: invalid.length, valid: valid.length };
  }
}
