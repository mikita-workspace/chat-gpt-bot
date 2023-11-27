import { BotContextType, SessionType } from '@bot/app/types';
import { ONE_HOUR_MS } from '@bot/common/constants';
import {
  createInitialClientSession,
  createInitialStoreSession,
  resetSelectedModel,
} from '@bot/common/helpers';
import { config } from '@bot/config';
import { freeStorage } from '@grammyjs/storage-free';
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
})() as StorageAdapter<Enhance<SessionType['client']>>;

const clientStorage = enhanceStorage({
  storage: storageAdapter,
  millisecondsToLive: ONE_HOUR_MS,
});

composer.use(
  session({
    type: 'multi',
    client: {
      storage: clientStorage,
      initial: createInitialClientSession,
    },
    selectedModel: {
      storage: freeStorage<SessionType['selectedModel']>(config.TELEGRAM_TOKEN),
      initial: resetSelectedModel,
    },
    store: {
      initial: createInitialStoreSession,
    },
    conversation: {},
  }),
);

export const sessionComposer = (): Middleware<BotContextType> => composer;
