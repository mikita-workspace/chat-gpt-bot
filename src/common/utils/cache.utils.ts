import { config } from '@bot/config';
import NodeCache from 'node-cache';

const TTL_DEFAULT = config.TTL_CACHE;

export const memoryCache = new NodeCache({
  stdTTL: TTL_DEFAULT,
});

export const setValueToMemoryCache = (key: string, value: string, expires = TTL_DEFAULT) =>
  memoryCache.set(key, value, expires);

export const removeValueFromMemoryCache = (key: string) => memoryCache.del(key);

export const getValueFromMemoryCache = (key: string) => memoryCache.get<string>(key);

export const fetchCachedData = async <T>(key: string, callback: () => T, expires = TTL_DEFAULT) => {
  const cachedData = getValueFromMemoryCache(key);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const response = await callback();

  setValueToMemoryCache(key, JSON.stringify(response), expires);

  return response;
};
