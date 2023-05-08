import { Schema, model } from 'mongoose';
import { SessionModelType } from '@bot/types';

const schema = new Schema<SessionModelType>({
  key: { type: String },
  value: {
    username: { type: String },
    messages: [],
  },
});

export const SessionModel = model('Session', schema);
