import { BotContextType, SessionType } from '@bot/app/types';
import { createInitialClientSession, createInitialStoreSession } from '@bot/common/helpers';
import { config } from '@bot/config';
import { freeStorage } from '@grammyjs/storage-free';
import { Composer, Middleware, session } from 'grammy';

const composer = new Composer<BotContextType>();

composer.use(
  session({
    type: 'multi',
    client: {
      storage: freeStorage<SessionType['client']>(config.TELEGRAM_TOKEN),
      initial: createInitialClientSession,
    },
    store: {
      initial: createInitialStoreSession,
    },
    conversation: {},
  }),
);

export const sessionComposer = (): Middleware<BotContextType> => composer;
