import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface Credits {
  email: number;
  sms: number;
}

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

  @Prop({ type: Object })
  credits: Credits;
}

export const UserSchema = SchemaFactory.createForClass(User);
