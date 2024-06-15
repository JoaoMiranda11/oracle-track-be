  // TODO: pass to userplan
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserPlan extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, unique: true })
  paymentId: string;

  @Prop({ required: true })
  planId: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ default: Date.now })
  createdAt?: Date;
}

export const UserPlanSchema = SchemaFactory.createForClass(UserPlan);
