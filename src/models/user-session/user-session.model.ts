import { UserSessionModelType } from '@bot/types';
import { model, Schema } from 'mongoose';

const schema = new Schema<UserSessionModelType>({
  key: { type: String },
  value: {
    username: { type: String },
    messages: [],
  },
});

export const UserSessionModel = model('UserSession', schema);
