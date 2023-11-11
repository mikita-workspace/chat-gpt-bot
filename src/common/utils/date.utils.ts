import {
  compareAsc,
  differenceInCalendarDays,
  differenceInMilliseconds,
  fromUnixTime,
  getUnixTime,
} from 'date-fns';

export const getTimestampUnix = (timestamp: number | string | Date) => {
  const date = new Date(timestamp);

  return getUnixTime(date);
};

export const isExpiredDate = (expiredAt: number) =>
  compareAsc(new Date(), fromUnixTime(expiredAt)) > 0;

export const expiresInMs = (expiredAt: number) =>
  Math.abs(differenceInMilliseconds(new Date(), fromUnixTime(expiredAt)));

export const expiresInDays = (expiredAt: number) =>
  Math.abs(differenceInCalendarDays(new Date(), fromUnixTime(expiredAt)));
