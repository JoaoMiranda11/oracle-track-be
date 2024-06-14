import { UserModule } from './modules/user/user.module';
import { ZenviaModule } from './modules/zenvia/zenvia.module';
import { DevModule } from './modules/_dev/dev.module';
import { MailModule } from './modules/mail/mail.module';
import { SmsModule } from './modules/sms/sms.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { IS_DEV } from './utils/globals';
import { AuthModule } from './modules/auth/auth.module';
import { DbConnections } from './libs/mongoose/connections';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ZenviaModule,
    MailModule,
    SmsModule,
    ...DbConnections,
    ...(IS_DEV ? [DevModule] : []),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
