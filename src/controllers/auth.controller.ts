import { Request, Response } from 'express';
import { IUser } from '../interfaces/user.interface';
import Users from '../models/user.model';
import { generateActiveToken } from '../config/generateToken';

export const signup = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, account, password }: IUser = req.body;
    const user = await Users.findOne({ account });
    if (user)
      return res
        .status(400)
        .json({ error: 'El correo electronico o el numero de celular ya existen' });

    const newUser = new Users({
      name,
      account,
      password,
    });

    const activeToken = generateActiveToken({ name, account, password });
    await newUser.save();

    return res.json({
      status: 'OK',
      message: 'Se registro correctamente',
      user: newUser,
      activeToken,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const signin = async (req: Request, res: Response): Promise<Response> => {
  try {
    return res.json({ message: 'Se registro correctamente' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
