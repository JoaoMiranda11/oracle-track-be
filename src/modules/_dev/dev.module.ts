import { Module } from '@nestjs/common';
import { DevController } from './dev.controller';
import { SmsModule } from '../sms/sms.module';
import { MailModule } from '../mail/mail.module';
import { ProductsModule } from '../products/products.module';
import { PaymentsModule } from '../payments/payments.module';
import { UserPlanModule } from '../userPlan/user-plan.module';

@Module({
  imports: [
    SmsModule,
    MailModule,
    ProductsModule,
    PaymentsModule,
    UserPlanModule,
  ],
  controllers: [DevController],
  providers: [],
})
export class DevModule {}
