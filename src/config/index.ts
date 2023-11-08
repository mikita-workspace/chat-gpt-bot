import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'development'}`),
});

export const config = {
  CHAT_GPT_API_HOST: process.env.CHAT_GPT_API_HOST ?? '',
  GIGA_CHAT_AUTH_TOKEN: process.env.GIGA_CHAT_AUTH_TOKEN ?? '',
  GITHUB_REPO: process.env.GITHUB_REPO ?? '',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN ?? '',
  GITHUB_USERNAME: process.env.GITHUB_USERNAME ?? '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? '',
  GOOGLE_DRIVE_ROOT_IMAGE_FOLDER_ID: process.env.GOOGLE_DRIVE_ROOT_IMAGE_FOLDER_ID ?? '',
  MONGODB_URI: process.env.MONGODB_URI ?? '',
  OPEN_AI_ORG: process.env.OPEN_AI_ORG ?? '',
  OPEN_AI_TOKEN: process.env.OPEN_AI_TOKEN ?? '',
  PORT: Number(process.env.PORT ?? 8080),
  SECRET_ENCRYPTION: process.env.SECRET_ENCRYPTION ?? '',
  SUPER_ADMIN_USERNAME: process.env.SUPER_ADMIN_USERNAME ?? '',
  SUPER_ADMIN_USER_ID: Number(process.env.SUPER_ADMIN_USER_ID ?? ''),
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN ?? '',
};
