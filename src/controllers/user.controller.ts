import { Response } from 'express';
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
