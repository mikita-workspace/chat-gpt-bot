import { Schema, model } from 'mongoose';

const schema = new Schema({
  key: { type: String },
  value: {
    username: { type: String },
    messages: [],
  },
});

export const SessionModel = model('Session', schema);
