import { Schema, model } from 'mongoose';
import { UserModelType } from '@bot/types';

const schema = new Schema<UserModelType>({
  timestamp: { type: Number, require: true, default: Date.now() },
  enabled: { type: Boolean, require: true, default: true },
  role: { type: String, required: true },
  username: { type: String, required: true, unique: true },
});

export const UserModel = model('User', schema);
