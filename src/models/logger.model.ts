import { LoggerModelType } from '@bot/types';
import { model, Schema } from 'mongoose';

const schema = new Schema<LoggerModelType>({
  level: { type: String },
  message: { type: String },
  meta: { type: Object },
  timestamp: { type: String },
});

export const LoggerModel = model('Logger', schema);
