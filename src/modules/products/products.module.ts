import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Plans, PlansSchema } from './entity/plans.schema';
import { Connections } from 'src/libs/mongoose/connections.enum';
import { ProductsService } from './products.service';
import { Packages, PackagesSchema } from './entity/packages.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Plans.name, schema: PlansSchema }],
      Connections.main,
    ),
    MongooseModule.forFeature(
      [{ name: Packages.name, schema: PackagesSchema }],
      Connections.main,
    ),

  ],
  controllers: [],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
