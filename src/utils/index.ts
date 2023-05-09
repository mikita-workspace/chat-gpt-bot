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
    logger.error(`util::removeFile::${(error as Error).message}`);
  }
};

export const isEmptyObject = (object: object) => Object.keys(object).length === 0;

export const parseTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);

  return `${date.toDateString()} ${date.toLocaleTimeString('en-US')}`;
};
