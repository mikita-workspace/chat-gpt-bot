import { UserModelType } from '@bot/types';
import { model, Schema } from 'mongoose';

const schema = new Schema<UserModelType>({
  conversation: { type: Schema.Types.ObjectId, ref: 'UserConversation', required: true },
  enabled: { type: Boolean, require: true, default: true },
  role: { type: String, required: true },
  timestamp: { type: Number, require: true, default: Date.now() },
  username: { type: String, required: true, unique: true },
});

export const UserModel = model('User', schema);
