import { LeanDocument, model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUserModel } from '../interfaces/user.interface';

const userSchema: Schema<IUserModel> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Porfavor agrege su nombre'],
      trim: true,
      maxLength: [20, 'Su nombre no puede ser mayor de 20 caracteres'],
    },
    account: {
      type: String,
      required: [true, 'Porfavor agrege su correo electronico o su numero de celular'],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Porfavor agrege su contraseña'],
    },
    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/images-store-cloud/image/upload/v1612363725/user_tvlxpm.png',
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    type: {
      type: String,
      default: 'normal',
    },
  },
  { timestamps: true },
);

userSchema.methods.matchPassword = async function (password: string): Promise<boolean> {
  const match = await bcrypt.compare(password, this.password);
  return match;
};

userSchema.methods.toJSON = function (): LeanDocument<IUserModel> {
  const obj = this.toObject();
  return { ...obj, password: '' };
};

export default model<IUserModel>('User', userSchema);
