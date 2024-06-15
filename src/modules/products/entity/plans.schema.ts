import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Plans extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  duration: number; // DAYS

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PlansSchema = SchemaFactory.createForClass(Plans);
