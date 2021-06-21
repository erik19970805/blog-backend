import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces/user.interface';
import Users from '../models/user.model';
import {
  generateAccessToken,
  generateActiveToken,
  generateRefreshToken,
} from '../config/generateToken';
import { validateEmail, validPhone } from '../middlewares/valid';
import sendEmail from '../config/sendEmail';
import { typeToken, urlClient } from '../config/config';
import { sendSms } from '../config/sendSMS';
import { IDecodedToken, ITypeToken } from '../interfaces/token.interfaces';

export const signup = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const { name, account, password }: IUser = req.body;
    const user = await Users.findOne({ account });
    if (user)
      return res
        .status(400)
        .json({ error: 'El correo electronico o el numero de celular ya existen' });

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = { name, account, password: passwordHash };
    const activeToken = generateActiveToken({ newUser });
    const url = `${urlClient}/active/${activeToken}`;

    if (validateEmail(account)) {
      sendEmail(account, url, 'Verifique su dirección de correo electrónico');
      return res.json({ message: 'Porfavor revice su correo electrónico' });
    }
    if (validPhone(account)) {
      sendSms(account, url, 'Verifique su numero de telefono');
      return res.json({ message: 'Porfavor revice su telefono' });
    }
    return undefined;
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const activeAccount = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { activeToken }: ITypeToken = req.body;
    const { newUser: userToken } = <IDecodedToken>jwt.verify(activeToken, typeToken.activeToken);
    if (!userToken) return res.status(400).json({ error: 'Autenticación inválida' });
    const user = await Users.findOne({ account: userToken.account });
    if (user)
      return res
        .status(400)
        .json({ error: 'La cuenta ya fue verificada, no se puede verificar otra vez' });
    const newUser = new Users(userToken);
    await newUser.save();
    return res.json({ message: 'Su cuenta ha sido verificada ya puede iniciar sección' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const signin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { account, password }: IUser = req.body;
    const user = await Users.findOne({ account });
    if (!user) return res.status(400).json({ error: 'La cuenta no existe' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Constraseña incorrecta' });

    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    res.cookie('refreshtoken', refreshToken, {
      httpOnly: true,
      path: '/api/auth/refresh_token',
      maxAge: 30 * 24 * 60 * 1000,
    });
    return res.json({
      message: 'Se inició sección correctamente',
      accessToken,
      user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const signout = (req: Request, res: Response): Response => {
  try {
    res.clearCookie('refreshtoken', { path: '/api/auth/refresh_token' });
    return res.json({ message: 'Se ha cerrado la sesión' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  try {
    const rfToken = req.cookies.refreshtoken;
    if (!rfToken) return res.status(400).json({ error: 'Por favor debe iniciar sesión' });
    const decoded = <IDecodedToken>jwt.verify(rfToken, typeToken.refreshToken);
    if (!decoded.id) return res.status(400).json({ error: 'Por favor debe iniciar sesión' });

    const user = await Users.findById(decoded.id).select('-password');
    if (!user) return res.status(400).json({ error: 'Esta cuenta no existe' });

    const accessToken = generateAccessToken({ id: user._id });

    return res.json({ accessToken });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
