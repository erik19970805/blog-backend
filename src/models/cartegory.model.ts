import { model, Schema } from 'mongoose';
import { IModelCategory } from '../interfaces/category.interface';

const categorySchema = new Schema<IModelCategory>(
  { name: { type: String, required: true, trim: true, unique: true } },
  { timestamps: true },
);

export default model<IModelCategory>('category', categorySchema);
