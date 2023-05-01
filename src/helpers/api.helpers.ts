import { telegramApi } from '../constants';

export const getFileApiLink = (token: string, filepath = '') =>
  `${telegramApi}/file/bot${token}/${filepath}`;
