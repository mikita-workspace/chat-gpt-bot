import { Schema, model } from 'mongoose';

const schema = new Schema({
  createTimestamp: { type: Number, require: true, default: Date.now() },
  enabled: { type: Boolean, require: true, default: false },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, required: true },
  telegramId: { type: Number, require: true, unique: true },
  username: { type: String, required: true, unique: true },
});

export const UserModel = model('User', schema);
