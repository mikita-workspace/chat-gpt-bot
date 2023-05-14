import { SessionModelType } from '@bot/types';
import { model, Schema } from 'mongoose';

const schema = new Schema<SessionModelType>({
  key: { type: String },
  value: {
    username: { type: String },
    messages: [],
    conversation: { type: Object, default: {} },
  },
});

export const SessionModel = model('Session', schema);
