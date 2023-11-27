import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'development'}`),
});

export const config = {
  BOT_NAME: process.env.BOT_NAME || '',
  CHAT_GPT_API_HOST: process.env.CHAT_GPT_API_HOST || '',
  PORT: parseInt(process.env.PORT ?? '', 10) || 8080,
  REDIS_URL: process.env.REDIS_URL || '',
  SLACK_WEBHOOK: process.env.SLACK_WEBHOOK || '',
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN ?? '',
  TTL_CACHE: parseInt(process.env.TTL_CACHE ?? '', 10) || 60,
  TTL_CONFIG_CACHE: parseInt(process.env.TTL_CONFIG_CACHE ?? '') || 600,
  USE_CLOUDINARY: process.env.USE_CLOUDINARY || 'false',
};
