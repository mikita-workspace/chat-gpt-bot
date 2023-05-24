import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'development'}`),
});

export const config = {
  MONGODB_URI: process.env.MONGODB_URI ?? '',
  OPEN_AI_ORG: process.env.OPEN_AI_ORG ?? '',
  OPEN_AI_TOKEN: process.env.OPEN_AI_TOKEN ?? '',
  RELEASE_VERSION: process.env.npm_package_version ?? '',
  SUPER_ADMIN_USERNAME: process.env.SUPER_ADMIN_USERNAME ?? '',
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN ?? '',
};
