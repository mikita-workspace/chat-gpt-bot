import {
  compareAsc,
  differenceInMilliseconds,
  format,
  formatDistance,
  fromUnixTime,
  getUnixTime,
} from 'date-fns';
import { be, enUS, ru } from 'date-fns/locale';

import { LocaleCodes } from '../constants';

export const convertLocale = (locale: string) => {
  switch (locale) {
    case LocaleCodes.RUSSIAN:
      return ru;
    case LocaleCodes.BELORUSSIAN:
      return be;
    default:
      return enUS;
  }
};

export const getTimestampUnix = (timestamp: number | string | Date = Date.now()) => {
  const date = new Date(timestamp);

  return getUnixTime(date);
};

export const isExpiredDate = (expiredAt: number) =>
  compareAsc(new Date(), fromUnixTime(expiredAt)) > 0;

export const expiresInMs = (expiredAt: number) =>
  Math.abs(differenceInMilliseconds(new Date(), fromUnixTime(expiredAt)));

export const expiresInFormat = (expiredAt: number, locale = 'en') => {
  const clientLocale = convertLocale(locale);

  return formatDistance(fromUnixTime(expiredAt), new Date(), {
    addSuffix: true,
    locale: clientLocale,
  });
};

export const formatDate = (date: number | Date, template: string, locale = 'en') => {
  const clientLocale = convertLocale(locale);

  return format(date, template, { locale: clientLocale });
};
