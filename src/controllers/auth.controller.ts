import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { IUser } from '../interfaces/user.interface';
import Users from '../models/user.model';
import {
  generateAccessToken,
  generateActiveToken,
  generateRefreshToken,
} from '../config/generateToken';
import { validateEmail, validPhone } from '../middlewares/valid';
import sendEmail from '../config/sendEmail';
import { api, apiFacebook, apiGoogle, typeToken, urlClient } from '../config/config';
import { sendSms, smsOTP, smsVerify } from '../config/sendSMS';
import { IDecodedToken, ITypeToken } from '../interfaces/token.interface';
import { IGgPayload } from '../interfaces/auth.interface';

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

export const signin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { account, password }: IUser = req.body;
    const user = await Users.findOne({ account });
    if (!user) return res.status(400).json({ error: 'La cuenta no existe' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const error =
        user.type === 'register'
          ? 'Constraseña incorrecta'
          : `Constraseña incorrecta. Esta cuenta esta logeada con ${user.type}`;
      return res.status(400).json({ error });
    }

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

    return res.json({ accessToken, user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const signinUser = async (
  data: IUser,
  password: string,
  res: Response,
): Promise<Response> => {
  try {
    const { account } = data;
    const user = await Users.findOne({ account });
    if (!user) return res.status(400).json({ error: 'La cuenta no existe' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Constraseña incorrecta' });

    const accessToken = generateAccessToken({ id: user._id });
    const refreshTokenG = generateRefreshToken({ id: user._id });

    res.cookie('refreshtoken', refreshTokenG, {
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

export const signupUser = async (data: IUser, res: Response): Promise<Response> => {
  try {
    const newUser = new Users(data);
    await newUser.save();

    const accessToken = generateAccessToken({ id: newUser._id });
    const refreshTokenG = generateRefreshToken({ id: newUser._id });

    res.cookie('refreshtoken', refreshTokenG, {
      httpOnly: true,
      path: '/api/auth/refresh_token',
      maxAge: 30 * 24 * 60 * 1000,
    });
    return res.json({
      message: 'Se inició sección correctamente',
      accessToken,
      user: { ...newUser, password: '' },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const googleSignin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { idToken } = req.body;
    const client = new OAuth2Client(`${apiGoogle.clientID}`);
    const verify = await client.verifyIdToken({ idToken, audience: apiGoogle.clientID });
    const { email, email_verified, name, picture } = <IGgPayload>verify.getPayload();
    if (!email_verified) return res.status(500).json({ error: 'Verificación del email fallida' });
    const password = `${email}your google secrect password`;
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await Users.findOne({ account: email });

    if (user) {
      return signinUser(user, password, res);
    }
    const newUser = {
      name,
      account: email,
      password: passwordHash,
      avatar: picture,
      type: 'google',
    };
    return signupUser(newUser, res);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const facebookSignin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { accessToken, userID } = req.body;

    const url = apiFacebook.apiFB1 + userID + apiFacebook.apiFB2 + accessToken;
    const { data } = await api('GET', url);
    const { email, name, picture } = data;

    const password = `${email}your faceebook secrect password`;
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await Users.findOne({ account: email });

    if (user) {
      return signinUser(user, password, res);
    }
    const newUser = {
      name,
      account: email,
      password: passwordHash,
      avatar: picture.data.url,
      type: 'facebook',
    };
    return signupUser(newUser, res);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const smsSignin = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { phone } = req.body;
    const data = await smsOTP(phone, 'sms');
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const verifySMS = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { phone, code } = req.body;

    const data = await smsVerify(phone, code);
    if (!data?.valid) return res.status(400).json({ msg: 'Invalid Authentication.' });

    const password = `${phone}your google secrect password`;
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await Users.findOne({ account: phone });

    if (user) {
      return signinUser(user, password, res);
    }
    const newUser = {
      name: phone,
      account: phone,
      password: passwordHash,
      type: 'sms',
    };
    return signupUser(newUser, res);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
