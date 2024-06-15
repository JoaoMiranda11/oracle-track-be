import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, InferSchemaType } from 'mongoose';

@Schema({ timestamps: true })
export class Packages extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: Date;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PackagesSchema = SchemaFactory.createForClass(Packages);