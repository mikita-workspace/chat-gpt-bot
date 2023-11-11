import { compareAsc, fromUnixTime, getUnixTime } from 'date-fns';

export const isExpiredDate = (expiredAt: number) =>
  compareAsc(new Date(), fromUnixTime(expiredAt)) > 0;

export const getTimestampUnix = (timestamp: number | string | Date) => {
  const date = new Date(timestamp);

  return getUnixTime(date);
};
