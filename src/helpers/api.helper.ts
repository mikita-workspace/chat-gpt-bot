import { TELEGRAM_API } from '@bot/constants';

export const getFileApiLink = (token: string, filepath = '') =>
  `${TELEGRAM_API}/file/bot${token}/${filepath}`;
