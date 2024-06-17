import { ObjectId } from 'mongoose';

export interface UserPlanInfo {
  dueDate: Date | null;
  startDate: Date | null;
  plan?: {
    name: string;
    planId: string | ObjectId | null;
    planCredits: number;
    description: string;
    duration: number;
    price: number;
    tier: number;
  };
}
