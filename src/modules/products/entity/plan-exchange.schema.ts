import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class PlanExchange { 
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Plan', required: true })
  initialPlan: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Plan', required: true })
  destinationPlan: Types.ObjectId;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  credits: number;
}

export type PlanExchangeDocument = Document<PlanExchange>;
export const PlanExchangeSchema = SchemaFactory.createForClass(PlanExchange);
