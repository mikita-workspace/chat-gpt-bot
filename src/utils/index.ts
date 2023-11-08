import { TTL_DEFAULT } from '@bot/constants';
import { logger } from '@bot/services';
import CryptoJS from 'crypto-js';
import { compareAsc, getUnixTime } from 'date-fns';
import { unlink } from 'fs/promises';
import NodeCache from 'node-cache';

export const memoryCache = new NodeCache({
  stdTTL: TTL_DEFAULT,
});

export const setValueToMemoryCache = (key: string, value: string, expires = TTL_DEFAULT) =>
  memoryCache.set(key, value, expires);

export const removeValueFromMemoryCache = (key: string) => memoryCache.del(key);

export const getValueFromMemoryCache = (key: string) => memoryCache.get<string>(key);

export const fetchCachedData = async <T>(key: string, callback: () => T) => {
  const cachedData = getValueFromMemoryCache(key);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const response = await callback();

  setValueToMemoryCache(key, JSON.stringify(response));

  return response;
};

export const removeFile = async (path: string) => {
  try {
    await unlink(path);
  } catch (error) {
    logger.error(`util::removeFile::${JSON.stringify(error.message)}`);
  }
};

export const isEmptyObject = (object: object) => Object.keys(object).length === 0;

export const getKeyByValue = (object: object, value: string) => {
  const indexOfObject = Object.values(object).indexOf(value as unknown as object);
  const key = Object.keys(object)[indexOfObject];

  return key;
};

export const uniqBy = <T>(arr: T[], key: keyof T): T[] =>
  Object.values(
    arr.reduce(
      (map, item) => ({
        ...map,
        [`${item[key]}`]: item,
      }),
      {},
    ),
  );

export const getTimestampUnix = (timestamp: number | string | Date) => {
  const date = new Date(timestamp);

  return getUnixTime(date);
};

export const getTimezoneString = (offset: number) => {
  const sign = offset <= 0 ? '+' : '-';
  const tzOffset = Math.abs(offset);
  const hours = Math.abs(Math.floor(tzOffset / 60));
  const minutes = Math.abs(tzOffset % 60);

  return `UTC ${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const isExpiredDate = (expiredAt: number | string) =>
  compareAsc(new Date(), new Date(expiredAt)) > 0;

export const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const randomChars = Math.random().toString(36).slice(2, 5);
  const uniqueId = timestamp + randomChars;

  return uniqueId;
};

// Source: https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const applyMixins = (derivedCtor: any, constructors: any[]) => {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null),
      );
    });
  });
};

export const encrypt = <T>(data: T, secret: string) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();

export const decrypt = (cipherText: string, secret: string) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secret);

  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
