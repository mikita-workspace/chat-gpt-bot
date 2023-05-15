import { UserConversationModelType } from '@bot/types';
import { model, Schema } from 'mongoose';

const schema = new Schema<UserConversationModelType>({
  key: { type: String },
  messages: [],
  username: { type: String },
});

export const UserConversationModel = model('UserConversation', schema);
