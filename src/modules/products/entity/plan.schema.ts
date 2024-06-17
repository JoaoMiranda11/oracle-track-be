import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Plan {
  @Prop({ type: Types.ObjectId, required: false })
  _id: Types.ObjectId | string;

  @Prop({ required: true, unique: true }) 
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  tier: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  credits: number;

  @Prop()
  createdAt?: Date;
}

export type PlanDocument = Document<Plan>;
export const PlanSchema = SchemaFactory.createForClass(Plan);
