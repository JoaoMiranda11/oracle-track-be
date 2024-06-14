import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from 'src/libs/aws/aws.module';

@Module({
  imports: [ConfigModule, AwsModule],
  controllers: [],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
