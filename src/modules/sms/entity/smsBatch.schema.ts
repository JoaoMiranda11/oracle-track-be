import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, QueryTimestampsConfig, Types } from 'mongoose';
import { UserSchema, User } from 'src/modules/user/entity/user.schema';
import { SmsProvider } from '../sms.enum';

@Schema({ timestamps: true })
export class SmsBatch {
  @Prop({ type: Types.ObjectId })
  userId: ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  ammount: number;

  @Prop({ type: Object })
  metadata: any;

  @Prop({ enum: SmsProvider, required: true })
  provider: SmsProvider;
}

export type SmsBatchDocument = SmsBatch & { _id: Types.ObjectId } & QueryTimestampsConfig;
export const SmsBatchSchema = SchemaFactory.createForClass(SmsBatch);

SmsBatchSchema.index({ userId: 1 });
