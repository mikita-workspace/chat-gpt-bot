import { compareAsc, fromUnixTime } from 'date-fns';

export const isExpiredDate = (expiredAt: number) =>
  compareAsc(new Date(), fromUnixTime(expiredAt)) > 0;
