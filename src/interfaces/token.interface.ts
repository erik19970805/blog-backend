import { INewUser } from './auth.interface';

export interface ITypeToken {
  activeToken: string;
  accessToken: string;
  refreshToken: string;
}

export interface IDecodedToken {
  id?: string;
  newUser?: INewUser;
  iat?: number;
  exp?: number;
}
