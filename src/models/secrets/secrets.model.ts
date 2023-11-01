import { SecretsModelType } from '@bot/types';
import { model, Schema } from 'mongoose';

const schema = new Schema<SecretsModelType>({
  gigaChatAccessToken: { type: String, default: '' },
  googleRefreshToken: { type: String, default: '' },
});

export const SecretsModel = model('Secrets', schema);
