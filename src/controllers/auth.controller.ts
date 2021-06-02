import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces/user.interface';
import Users from '../models/user.model';
import { generateActiveToken } from '../config/generateToken';
import { validateEmail, validPhone } from '../middlewares/valid';
import sendEmail from '../config/sendEmail';
import { typeToken, urlClient } from '../config/config';
import { sendSms } from '../config/sendSMS';
import { ITypeToken } from '../interfaces/token.interfaces';

export const signup = async (req: Request, res: Response): Promise<Response | undefined> => {
  try {
    const { name, account, password }: IUser = req.body;
    const user = await Users.findOne({ account });
    if (user)
      return res
        .status(400)
        .json({ error: 'El correo electronico o el numero de celular ya existen' });

    const passwordHash = await bcrypt.hash(password, 12);
    // const newUser = new Users();

    const activeToken = generateActiveToken({ name, account, password: passwordHash });
    // await newUser.save();
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
    const decoded = jwt.verify(activeToken, typeToken.activeToken);
    if (!decoded) return res.status(400).json({ error: 'Autenticación inválida' });
    const newUser = new Users(decoded);
    await newUser.save();
    return res.json({ message: 'Su cuenta ha sido verificada ya puede iniciar sección' });
  } catch (error) {
    let errMsg;
    let name;
    if (error.code === 11000) {
      errMsg = `${Object.keys(error.keyValue)[0]} Ya existe`;
    } else if (error.errors) {
      name = Object.keys(error.errors)[0] as string;
      errMsg = error.errors[`${name}`].message;
    } else {
      errMsg = error.message;
    }
    return res.status(500).json({ error: errMsg });
  }
};

export const signin = async (req: Request, res: Response): Promise<Response> => {
  try {
    return res.json({ message: 'Se registro correctamente' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
