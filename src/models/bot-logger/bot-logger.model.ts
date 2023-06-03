import { BotLoggerModelType } from '@bot/types';
import { model, Schema } from 'mongoose';

const schema = new Schema<BotLoggerModelType>({
  level: { type: String },
  message: { type: String },
  meta: { type: Object },
  timestamp: { type: Date },
});

export const BotLoggerModel = model('BotLogger', schema);
