import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';


import { Module } from '@nestjs/common';
import { AwsModule } from 'src/libs/aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [SmsController],
  providers: [SmsService],
})
export class SmsModule {}
