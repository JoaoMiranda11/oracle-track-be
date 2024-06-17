import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserStatus } from '../user.enum';

@Schema()
export class AuthInfo extends Document {
  @Prop({ type: String, default: null })
  otp: string | null;

  @Prop({ type: Date, default: null })
  dueDate: Date | null;

  @Prop({ type: String, default: null })
  hash: string | null;

  @Prop({ type: Number, default: 0 })
  tries: number;
}

@Schema()
export class UserPlan {
  @Prop({ type: Types.ObjectId, ref: 'Plan', required: true })
  planId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  dueDate: Date;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  role: string;

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ required: true, default: UserStatus.Inactive })
  status: UserStatus;

  @Prop({ required: true, type: Number, default: 0 })
  credits: number;

  @Prop({ type: UserPlan })
  plan: UserPlan;

  @Prop({
    type: Object,
    default: {
      otp: null,
      dueDate: null,
      hash: null,
      tries: 0,
    },
  })
  auth: AuthInfo;
}

export type UserDocument = User & { _id: Types.ObjectId};
export const UserSchema = SchemaFactory.createForClass(User);
