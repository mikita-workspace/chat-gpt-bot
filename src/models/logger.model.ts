import { LoggerModelType } from '@bot/types';
import { model, Schema } from 'mongoose';

const schema = new Schema<LoggerModelType>({
  timestamp: { type: String },
  level: { type: String },
  message: { type: String },
});

export const LoggerModel = model('Logger', schema);
