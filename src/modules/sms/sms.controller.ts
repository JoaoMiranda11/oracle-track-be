import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SmsService } from './sms.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    await this.smsService.processCSV(file);

    return { message: 'File uploaded and processed successfully' };
  }
}
