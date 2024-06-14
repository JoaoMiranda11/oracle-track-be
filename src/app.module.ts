import { DevModule } from './modules/dev/dev.module';
import { MailModule } from './modules/mail/mail.module';
import { SmsModule } from './modules/sms/sms.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { IS_DEV } from './utils/globals';

@Module({
  imports: [
    ...(IS_DEV ? [ DevModule ] : []),
    MailModule,
    SmsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
