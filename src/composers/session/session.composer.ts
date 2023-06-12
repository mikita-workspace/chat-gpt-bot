import { config } from '@bot/config';
import {
  createInitialLimitSessionData,
  createInitialMemorySessionData,
  createInitialUserSessionData,
} from '@bot/helpers';
import { mongo } from '@bot/services';
import { BotContextType, SessionType } from '@bot/types';
import { freeStorage } from '@grammyjs/storage-free';
import { Composer, Middleware, session } from 'grammy';

const composer = new Composer<BotContextType>();

composer.use(
  session({
    type: 'multi',
    user: {
      storage: mongo.sessionAdapter,
      initial: createInitialUserSessionData,
    },
    conversation: {},
    limit: {
      storage: freeStorage<SessionType['limit']>(config.TELEGRAM_TOKEN),
      initial: createInitialLimitSessionData,
    },
    memory: {
      initial: createInitialMemorySessionData,
    },
  }),
);

export const sessionComposer = (): Middleware<BotContextType> => composer;
