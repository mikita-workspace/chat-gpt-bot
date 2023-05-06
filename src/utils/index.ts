import { unlink } from 'fs/promises';
import NodeCache from 'node-cache';
import { TTL_DEFAULT } from '../constants';

export const memoryCache = new NodeCache({
  stdTTL: TTL_DEFAULT,
});

export const setValueToMemoryCache = <T>(
  key: string,
  value: T,
  expires = TTL_DEFAULT,
) => memoryCache.set(key, value, expires);

export const removeValueFromMemoryCache = (key: string) => memoryCache.del(key);

export const getValueFromMemoryCache = (key: string) => memoryCache.get(key);

export const fetchCachedData = async <T>(
  key: string,
  dataCallback: () => T,
) => {
  const cachedData = getValueFromMemoryCache(key);

  if (cachedData) {
    return cachedData;
  }

  const response = await dataCallback();

  setValueToMemoryCache<T>(key, response);

  return response;
};

export const removeFile = async (path: string) => {
  try {
    await unlink(path);
  } catch (error) {
    console.error(`ERROR::util::removeFile::${(error as Error).message}`);
  }
};

export const isEmptyObject = (object: object) =>
  Object.keys(object).length === 0;

export const parseTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);

  return `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString(
    'en-US',
  )}`;
};
