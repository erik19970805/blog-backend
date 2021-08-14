import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { IReqAuth } from '../interfaces/user.interface';
import Users from '../models/user.model';

export const updateUser = async (req: IReqAuth, res: Response): Promise<Response> => {
  if (!req.user) return res.status(400).json({ message: 'Autenticación Invalida' });
  try {
    const { avatar, name } = req.body;
    await Users.findOneAndUpdate({ _id: req.user._id }, { avatar, name });
    return res.json({ message: 'Se actualizo correctamente' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req: IReqAuth, res: Response): Promise<Response> => {
  if (!req.user) return res.status(400).json({ message: 'Autenticación Invalida' });
  if (req.user.type !== 'register')
    return res.status(400).json({
      message: ` Se Inicio sesión rápida con ${req.user.type}, por ende no puede utilizar esta función`,
    });
  try {
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);
    await Users.findOneAndUpdate({ _id: req.user._id }, { password: passwordHash });
    return res.json({ message: 'Su contraseña ha sido actualizada' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await Users.findById(req.params.id).select('-password');
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
