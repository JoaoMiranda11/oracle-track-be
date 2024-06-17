import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, InferSchemaType } from 'mongoose';
import { PackageEnum } from '../products.enum';

@Schema({ timestamps: true })
export class Packages {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  type: PackageEnum;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  credits: number;

  @Prop({ default: Date.now() })
  createdAt?: Date;
}

export type PackagesDocument = Document<Packages>;
export const PackagesSchema = SchemaFactory.createForClass(Packages);
