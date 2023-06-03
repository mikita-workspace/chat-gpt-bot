import { TTL_DEFAULT } from '@bot/constants';
import { logger } from '@bot/services';
import { unlink } from 'fs/promises';
import NodeCache from 'node-cache';

export const memoryCache = new NodeCache({
  stdTTL: TTL_DEFAULT,
});

export const setValueToMemoryCache = (key: string, value: string, expires = TTL_DEFAULT) =>
  memoryCache.set(key, value, expires);

export const removeValueFromMemoryCache = (key: string) => memoryCache.del(key);

export const getValueFromMemoryCache = (key: string) => memoryCache.get<string>(key);

export const fetchCachedData = async <T>(key: string, dataCallback: () => T) => {
  const cachedData = getValueFromMemoryCache(key);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const response = await dataCallback();

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

export const parseTimestampUTC = (timestamp: number) => {
  const date = new Date(timestamp);

  return date.toUTCString();
};

export const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

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
