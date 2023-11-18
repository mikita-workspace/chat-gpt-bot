import { BotContextType, SessionType } from '@bot/app/types';
import { ONE_HOUR_MS } from '@bot/common/constants';
import { createInitialClientSession, createInitialStoreSession } from '@bot/common/helpers';
import { config } from '@bot/config';
import { freeStorage } from '@grammyjs/storage-free';
import { Composer, enhanceStorage, Middleware, session } from 'grammy';

const composer = new Composer<BotContextType>();

const clientStorage = enhanceStorage<SessionType['client']>({
  storage: freeStorage(config.TELEGRAM_TOKEN),
  millisecondsToLive: ONE_HOUR_MS,
});

composer.use(
  session({
    type: 'multi',
    client: {
      storage: clientStorage,
      initial: createInitialClientSession,
    },
    store: {
      initial: createInitialStoreSession,
    },
    conversation: {},
  }),
);

export const sessionComposer = (): Middleware<BotContextType> => composer;
