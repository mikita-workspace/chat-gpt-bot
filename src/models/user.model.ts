import { Schema, model } from 'mongoose';

const schema = new Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, required: true },
});

export const UserModel = model('User', schema);
