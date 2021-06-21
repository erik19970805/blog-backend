import jwt from 'jsonwebtoken';
import { typeToken } from './config';
import { IDecodedToken } from '../interfaces/token.interfaces';

export const generateActiveToken = (payload: IDecodedToken): string =>
  jwt.sign(payload, `${typeToken.activeToken}`, { expiresIn: '5m' });

export const generateAccessToken = (payload: { id: string }): string =>
  jwt.sign(payload, `${typeToken.accessToken}`, { expiresIn: '15m' });

export const generateRefreshToken = (payload: { id: string }): string =>
  jwt.sign(payload, `${typeToken.refreshToken}`, { expiresIn: '30d' });
