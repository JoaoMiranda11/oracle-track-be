import { MulterModule } from '@nestjs/platform-express';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';
import { Module } from '@nestjs/common';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [SmsController],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
