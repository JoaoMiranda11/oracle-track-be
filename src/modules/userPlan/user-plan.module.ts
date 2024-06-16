import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPlan, UserPlanSchema } from './entity/userPlan.schema';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { UserPlanService } from './user-plan.service';
import { ProductsModule } from '../products/products.module';
import { PaymentsModule } from '../payments/payments.module';
import { UserModule } from '../user/user.module';
import { UserPlanController } from './user-plan.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: UserPlan.name, schema: UserPlanSchema }],
      Connections.main,
    ),
    ProductsModule,
    PaymentsModule,
    UserModule,
  ],
  controllers: [UserPlanController],
  providers: [UserPlanService],
  exports: [UserPlanService],
})
export class UserPlanModule {}
