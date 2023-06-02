import { config } from '@bot/config';
import { createInitialCustomSessionData, createInitialLimitSessionData } from '@bot/helpers';
import { mongo } from '@bot/services';
import { BotContextType, SessionType } from '@bot/types';
import { freeStorage } from '@grammyjs/storage-free';
import { Composer, Middleware, session } from 'grammy';

const composer = new Composer<BotContextType>();

composer.use(
  session({
    type: 'multi',
    custom: {
      storage: mongo.sessionAdapter,
      initial: createInitialCustomSessionData,
    },
    conversation: {},
    limit: {
      storage: freeStorage<SessionType['limit']>(config.TELEGRAM_TOKEN),
      initial: createInitialLimitSessionData,
    },
  }),
);

export const sessionComposer = (): Middleware<BotContextType> => composer;
