import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'development'}`),
});

export const config = {
  CHAT_GPT_API_HOST: process.env.CHAT_GPT_API_HOST || '',
  MONGODB_URI: process.env.MONGODB_URI ?? '',
  PORT: parseInt(process.env.PORT ?? '', 10) || 8080,
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN ?? '',
  TTL_CACHE: parseInt(process.env.TTL_CACHE ?? '', 10) || 60,
  TTL_CONFIG_CACHE: parseInt(process.env.TTL_CONFIG_CACHE ?? '') || 600,
  USE_CLOUDINARY: process.env.USE_CLOUDINARY || 'false',
};
