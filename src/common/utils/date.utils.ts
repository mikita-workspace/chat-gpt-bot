import { UTCDate } from '@date-fns/utc';
import {
  addDays,
  addMilliseconds,
  addSeconds,
  compareAsc,
  differenceInMilliseconds,
  format,
  formatDistance,
} from 'date-fns';
import { be, enUS, ru } from 'date-fns/locale';

import { LocaleCode, MIN_IN_MS } from '../constants';

export const convertLocale = (locale: string) => {
  switch (locale) {
    case LocaleCode.RUSSIAN:
      return ru;
    case LocaleCode.BELORUSSIAN:
      return be;
    default:
      return enUS;
  }
};

export const getTimestampUtc = (timestamp: number | string | Date = new UTCDate()) =>
  new UTCDate(timestamp);

export const getTimestampPlusMilliseconds = (ms = 0, startDate = getTimestampUtc()) => {
  const newDate = addMilliseconds(startDate, ms);

  return getTimestampUtc(newDate);
};

export const getTimestampPlusSeconds = (sec = 0, startDate = getTimestampUtc()) => {
  const newDate = addSeconds(startDate, sec);

  return getTimestampUtc(newDate);
};

export const getTimestampPlusDays = (days = 0, startDate = getTimestampUtc()) => {
  const newDate = addDays(startDate, days);

  return getTimestampUtc(newDate);
};

export const isExpiredDate = (expiresAt: Date) => compareAsc(getTimestampUtc(), expiresAt) > 0;

export const expiresInMs = (expiresAt: Date) =>
  Math.abs(differenceInMilliseconds(getTimestampUtc(), expiresAt));

export const expiresInFormat = (expiresAt: Date, locale = 'en') => {
  const clientLocale = convertLocale(locale);

  return formatDistance(expiresAt, getTimestampUtc(), {
    addSuffix: true,
    locale: clientLocale,
  });
};

export const fromMsToMins = (ms: number | string) => parseInt(String(ms), 10) / MIN_IN_MS;

export const formatDate = (date: Date, template: string, locale = 'en') => {
  const clientLocale = convertLocale(locale);

  return format(date, template, { locale: clientLocale });
};
