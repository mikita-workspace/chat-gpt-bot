import { Schema, model, Types } from 'mongoose';

const schema = new Schema({
  firstname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  telegramId: { type: String, required: true, unique: true },
  messages: [{ type: Object, required: true }],
});

export const UserModel = model('User', schema);
