import { UserPlansController } from './userplans.controller';
import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ProductsModule } from '../products/products.module';
import { UserPlansService } from './userPlans.service';

@Module({
  imports: [UserModule, ProductsModule],
  controllers: [UserPlansController],
  providers: [UserPlansService],
  exports: [UserPlansService],
})
export class UserPlansModule {}
