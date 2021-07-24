import { model, Schema, Types } from 'mongoose';

const blogSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'user' },
    title: { type: String, require: true, trim: true, minLength: 10, maxLenght: 50 },
    content: { type: String, require: true, minLength: 2000 },
    description: { type: String, require: true, trim: true, minLength: 50, maxLenght: 200 },
    thumbnail: { type: String, require: true },
    category: { type: Types.ObjectId, ref: 'category' },
  },
  { timestamps: true },
);

export default model('blog', blogSchema);
