import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { typeToken } from '../config/config';
import { IDecodedToken } from '../interfaces/token.interface';
import Users from '../models/user.model';
import { IReqAuth } from '../interfaces/user.interface';

export const auth = async (
  req: IReqAuth,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  try {
    const token = req.header('Authorization');
    if (!token) return res.status(400).json({ message: 'Autenticación Invalida' });
    const decoded = <IDecodedToken>jwt.verify(token, typeToken.accessToken);
    if (!decoded) return res.status(400).json({ message: 'Autenticación Invalida' });
    const user = await Users.findOne({ _id: decoded.id });
    if (!user) return res.status(400).json({ message: 'El usuario no existe' });
    req.user = user;
    return next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
