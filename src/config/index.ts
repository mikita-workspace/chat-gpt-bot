import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'development'}`),
});

export const config = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN ?? '',
  OPEN_AI_TOKEN: process.env.OPEN_AI_TOKEN ?? '',
  MONGODB_URI: process.env.MONGODB_URI ?? '',
};
