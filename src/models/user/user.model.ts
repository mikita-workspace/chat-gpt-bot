import { DAY_MS, LimitsGPT } from '@bot/constants';
import { UserModelType } from '@bot/types';
import { parseTimestampUTC } from '@bot/utils';
import { model, Schema } from 'mongoose';

const [gptTokens, gptImages] = LimitsGPT.BASE.split('/');

const schema = new Schema<UserModelType>({
  conversation: { type: Schema.Types.ObjectId, ref: 'UserConversation', required: true },
  enabled: { type: Boolean, require: true, default: true },
  limit: {
    availableGPTModels: [],
    gptTokens: { type: Number, require: true, default: Number(gptTokens) },
    gptImages: { type: Number, require: true, default: Number(gptImages) },
    expire: { type: String, require: true, default: parseTimestampUTC(Date.now() + DAY_MS) },
  },
  role: { type: String, required: true },
  timestamp: { type: String, require: true, default: parseTimestampUTC(Date.now()) },
  username: { type: String, required: true, unique: true },
});

export const UserModel = model('User', schema);
