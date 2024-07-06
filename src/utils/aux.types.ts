import { ClientSession, Schema } from 'mongoose';

export interface QueryOptions {
  session?: ClientSession;
}

export type QueryProjection<T extends Object> = Partial<Record<keyof T, 1 | 0>>;

export interface QueryFindOptions<T extends Object> extends QueryOptions {
  project?: QueryProjection<T>;
}
