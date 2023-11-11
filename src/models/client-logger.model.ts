import { ClientLoggerModelType } from '@bot/models/types';
import { model, Schema } from 'mongoose';

const schema = new Schema<ClientLoggerModelType>({
  level: { type: String },
  message: { type: String },
  meta: { type: Object },
  timestamp: { type: Number },
});

export const ClientLoggerModel = model('ClientLogger', schema);
