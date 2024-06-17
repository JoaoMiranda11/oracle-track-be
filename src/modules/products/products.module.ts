import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { ProductsService } from './products.service';
import { Packages, PackagesSchema } from './entity/packages.schema';
import { PlanExchange, PlanExchangeSchema } from './entity/plan-exchange.schema';
import { Plan, PlanSchema } from './entity/plan.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Plan.name, schema: PlanSchema }],
      Connections.main,
    ),
    MongooseModule.forFeature(
      [{ name: Packages.name, schema: PackagesSchema }],
      Connections.main,
    ),
    MongooseModule.forFeature(
      [{ name: PlanExchange.name, schema: PlanExchangeSchema }],
      Connections.main,
    ),
  ],
  controllers: [],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
