import { DAY_MS, PER_DAY_GPT_IMAGE_LIMIT, PER_DAY_GPT_TOKEN_LIMIT } from '@bot/constants';
import { UserModelType } from '@bot/types';
import { parseTimestampUTC } from '@bot/utils';
import { model, Schema } from 'mongoose';

const schema = new Schema<UserModelType>({
  conversation: { type: Schema.Types.ObjectId, ref: 'UserConversation', required: true },
  enabled: { type: Boolean, require: true, default: true },
  limit: {
    gptTokens: { type: Number, require: true, default: PER_DAY_GPT_TOKEN_LIMIT },
    gptImages: { type: Number, require: true, default: PER_DAY_GPT_IMAGE_LIMIT },
    expire: { type: String, require: true, default: parseTimestampUTC(Date.now() + DAY_MS) },
  },
  role: { type: String, required: true },
  timestamp: { type: String, require: true, default: parseTimestampUTC(Date.now()) },
  username: { type: String, required: true, unique: true },
});

export const UserModel = model('User', schema);
