import { config } from '@bot/config';
import { createInitialClientSessionData } from '@bot/helpers';
import { BotContextType, SessionType } from '@bot/types';
import { freeStorage } from '@grammyjs/storage-free';
import { Composer, Middleware, session } from 'grammy';

const composer = new Composer<BotContextType>();

composer.use(
  session({
    type: 'multi',
    client: {
      storage: freeStorage<SessionType['client']>(config.TELEGRAM_TOKEN),
      initial: createInitialClientSessionData,
    },
    conversation: {},
  }),
);

export const sessionComposer = (): Middleware<BotContextType> => composer;
