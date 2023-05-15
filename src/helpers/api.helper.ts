import { telegramApi } from '@bot/constants';

export const getFileApiLink = (token: string, filepath = '') =>
  `${telegramApi}/file/bot${token}/${filepath}`;
