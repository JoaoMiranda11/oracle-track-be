import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  PaymentGateway,
  PaymentMethod,
  PaymentStatus,
  ProductType,
} from '../payment.enum';

@Schema()
export class Payment {
  @Prop({ required: true })
  recurring: boolean;

  @Prop({ type: Types.ObjectId, required: true })
  productId: Types.ObjectId;

  @Prop({ enum: ProductType, required: true })
  productType: ProductType;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ enum: PaymentMethod, required: true })
  method: PaymentMethod;

  @Prop({ enum: PaymentGateway, required: true })
  paymentGateway: PaymentGateway;

  @Prop({ required: true })
  paymentId: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  discount: number;

  @Prop({ enum: PaymentStatus, required: true })
  status: PaymentStatus;

  @Prop({ type: Date, required: true })
  dueDate: Date;

  @Prop({ required: true })
  installments: number;

  @Prop({ type: Object })
  metadata?: any;

  @Prop()
  description?: string;
}

export type PaymentDocument = Document<Payment>;
export const PaymentSchema = SchemaFactory.createForClass(Payment);
