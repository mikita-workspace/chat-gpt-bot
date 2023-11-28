import { config } from '@bot/config';
import IORedis from 'ioredis';
import NodeCache from 'node-cache';

const TTL_DEFAULT = config.TTL_CACHE;

export const cacheProvider = (() => {
  if (process.env.NODE_ENV === 'production') {
    const [redisPassword, redisHost, redisPort] = config.REDIS_URL.split(':');

    return new IORedis(Number(redisPort), redisHost, {
      password: redisPassword,
    });
  }

  return new NodeCache({
    stdTTL: TTL_DEFAULT,
  });
})();

export const setValueToMemoryCache = async (key: string, value: string, expires = TTL_DEFAULT) => {
  if (cacheProvider instanceof IORedis) {
    return cacheProvider.set(key, value, 'EX', expires);
  }

  return cacheProvider.set(key, value, expires);
};

export const removeValueFromMemoryCache = async (key: string) => cacheProvider.del(key);

export const getValueFromMemoryCache = async (key: string): Promise<string | null> =>
  cacheProvider.get(key) as string | null;

export const fetchCachedData = async <T>(key: string, callback: () => T, expires = TTL_DEFAULT) => {
  const cachedData = await getValueFromMemoryCache(key);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const response = await callback();

  await setValueToMemoryCache(key, JSON.stringify(response), expires);

  return response;
};
