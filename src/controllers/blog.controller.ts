import { Response } from 'express';
import { IBlog } from '../interfaces/blog.interface';
import { IReqAuth } from '../interfaces/user.interface';
import Blogs from '../models/blog.model';

export const createBlog = async (req: IReqAuth, res: Response): Promise<Response> => {
  try {
    const { title, content, description, thumbnail, category }: IBlog = req.body;
    const newBlog = new Blogs({
      user: req.user?.id,
      title,
      content,
      description,
      thumbnail,
      category,
    });

    await newBlog.save();
    res.json({ newBlog, message: 'Se creo correctamente el blog' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.json();
};
