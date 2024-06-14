import { SmsService } from './sms.service';
import { Module } from '@nestjs/common';
import { AwsModule } from 'src/libs/aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [],
  providers: [SmsService],
  exports: [SmsService]
})
export class SmsModule {}
