import { TELEGRAM_API } from '@bot/constants';

export const getFileApiLink = (token: string, filepath: string) =>
  `${TELEGRAM_API}/file/bot${token}/${filepath}`;
