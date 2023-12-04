import { BotContextType, SessionType } from '@bot/app/types';
import { ONE_HOUR_MS } from '@bot/common/constants';
import { createInitialClientSession, createInitialStoreSession } from '@bot/common/helpers';
import { config } from '@bot/config';
import { RedisAdapter } from '@grammyjs/storage-redis';
import { StorageAdapter } from '@grammyjs/storage-redis/dist/cjs/deps.node';
import {
  Composer,
  Enhance,
  enhanceStorage,
  MemorySessionStorage,
  Middleware,
  session,
} from 'grammy';
import IORedis from 'ioredis';

const composer = new Composer<BotContextType>();

const storageAdapter = (() => {
  if (process.env.NODE_ENV === 'production') {
    const [redisPassword, redisHost, redisPort] = config.REDIS_URL.split(':');
    const redisInstance = new IORedis(Number(redisPort), redisHost, {
      password: redisPassword,
    });

    return new RedisAdapter({
      instance: redisInstance,
      ttl: ONE_HOUR_MS / 1000,
    });
  }

  return new MemorySessionStorage();
})();

const clientStorage = <T>() =>
  enhanceStorage({
    storage: storageAdapter as StorageAdapter<Enhance<T>>,
    millisecondsToLive: ONE_HOUR_MS,
  });

composer.use(
  session({
    type: 'multi',
    client: {
      storage: clientStorage<SessionType['client']>(),
      initial: createInitialClientSession,
    },
    store: {
      initial: createInitialStoreSession,
    },
    conversation: {},
  }),
);

export const sessionComposer = (): Middleware<BotContextType> => composer;
