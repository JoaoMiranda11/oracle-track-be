import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';
import { SmsBatch } from './smsBatch.schema';
import { MessageStatus } from '../sms.enum';

@Schema({ timestamps: true })
export class SmsMessage {
  @Prop({ required: true })
  phone: string;

  @Prop({ ref: SmsBatch.name, type: Types.ObjectId })
  smsBatchId: ObjectId;

  @Prop({ required: true, enum: MessageStatus })
  status: MessageStatus;

  @Prop({ type: Object })
  metadata: any;
}

export type SmsDocument = SmsMessage & { _id: Types.ObjectId };
export const SmsMessageSchema = SchemaFactory.createForClass(SmsMessage);
SmsMessageSchema.index({ smsBatchId: 1 });
