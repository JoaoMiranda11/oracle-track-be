import { Module } from '@nestjs/common';
import { DevController } from './dev.controller';
import { SmsModule } from '../sms/sms.module';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [SmsModule, MailModule],
    controllers: [DevController],
    providers: [],
})
export class DevModule {}
