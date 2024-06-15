import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  itemId: string;

  @Prop({ required: true })
  itemType: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  paymentGateway: string;

  @Prop({ required: true, unique: true })
  paymentId: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop()
  discountFlat?: number;

  @Prop()
  discountPercentage?: number;

  @Prop()
  details?: string;

  @Prop()
  taxes?: number;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
