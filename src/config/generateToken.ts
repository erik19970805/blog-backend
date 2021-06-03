import jwt from 'jsonwebtoken';
import { IUser, IUserModel } from '../interfaces/user.interface';
import { typeToken } from './config';

export const generateActiveToken = (payload: IUser): string =>
  jwt.sign(payload, `${typeToken.activeToken}`, { expiresIn: '5m' });

export const generateAccessToken = (payload: { id: string }): string =>
  jwt.sign(payload, `${typeToken.accessToken}`, { expiresIn: '15m' });

export const generateRefreshToken = (payload: { id: string }): string =>
  jwt.sign(payload, `${typeToken.refreshToken}`, { expiresIn: '30d' });
