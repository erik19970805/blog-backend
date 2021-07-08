import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser {
  name: string;
  account: string;
  password: string;
  avatar?: string;
  role?: string;
  type?: string;
}

export interface IUserModel extends Document, IUser {
  matchPassword: (password: string) => Promise<boolean>;
}

export interface IReqAuth extends Request {
  user?: IUserModel;
}
