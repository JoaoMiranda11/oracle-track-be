import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserStatus } from '../user.enum';

export interface AuthInfo {
  otp: null | string;
  dueDate: null | Date;
  hash: null | string;
  tries: null | number;
}

const defaultAuthInfo: AuthInfo = {
  otp: null,
  dueDate: null,
  hash: null,
  tries: null,
};
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  role: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true, default: UserStatus.Inactive })
  status: UserStatus;

  @Prop({ type: Object, default: 0 })
  credits?: number;

  @Prop({
    type: Object,
    default: defaultAuthInfo,
  })
  auth?: AuthInfo;
}

export const UserSchema = SchemaFactory.createForClass(User);
