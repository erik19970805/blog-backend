import { Request, Response } from 'express';
import { IReqAuth } from '../interfaces/user.interface';
import Category from '../models/cartegory.model';

export const getCategories = async (req: Request, res: Response): Promise<Response> => {
  try {
    const categories = await Category.find().sort('-createdAt');
    return res.json({ categories });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getCategory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const category = await Category.findById(req.params.id).sort('-createdAt');
    return res.json({ category });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req: IReqAuth, res: Response): Promise<Response> => {
  try {
    const name = req.body.name.toLowerCase();
    const newCategory = new Category({ name });
    await newCategory.save();
    return res.json({ category: newCategory, message: 'Se creo correctamente la categoria' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req: IReqAuth, res: Response): Promise<Response> => {
  try {
    const name = req.body.name.toLowerCase();
    await Category.findOneAndUpdate({ _id: req.params.id }, { name });
    return res.json({ message: 'Se actualizo correctamente la categoria' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req: IReqAuth, res: Response): Promise<Response> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    return res.json({ category, message: 'Se elimino correctamente la categoria' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
