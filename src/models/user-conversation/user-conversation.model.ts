import { UserConversationModelType } from '@bot/types';
import { model, Schema } from 'mongoose';

const schema = new Schema<UserConversationModelType>({
  messages: [],
  username: { type: String, unique: true },
});

export const UserConversationModel = model('UserConversation', schema);
