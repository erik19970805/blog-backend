import { Request, Response, NextFunction } from 'express';
import { IUser } from '../interfaces/user.interface';

export const validateEmail = (email: string): boolean => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validPhone = (phone: string): boolean => {
  const re = /^[+]/g;
  return re.test(phone);
};

export const validSignup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response> => {
  const { name, account, password }: IUser = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Porfavor agrege su nombre' });
  }
  if (name.length > 20) {
    return res.status(400).json({ error: 'Su nombre no puede ser mayor de 20 caracteres' });
  }
  if (!account) {
    return res
      .status(400)
      .json({ error: 'Porfavor agrege su correo electronico o su numero de celular' });
  }
  if (!validPhone(account) && !validateEmail(account)) {
    return res
      .status(400)
      .json({ error: 'El formato del correo electronico o del numero de celular son incorrectos' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener minimo 6 caracteres' });
  }
  next();
  return undefined;
};
