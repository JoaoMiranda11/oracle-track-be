import { Request } from 'express';
import { ObjectId } from 'mongoose';

export interface JwtUserInfo {
  _id: string;
  email: string;
  role: string;
  status: string;
}

export interface AuthenticatedRequest extends Request {
  user: JwtUserInfo;
}
