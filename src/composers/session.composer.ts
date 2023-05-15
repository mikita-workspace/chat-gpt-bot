import { createInitialSessionData } from '@bot/helpers';
import { mongo } from '@bot/services';
import { BotContextType } from '@bot/types';
import { Composer, Middleware, session } from 'grammy';

const composer = new Composer<BotContextType>();

composer.use(
  session({
    type: 'multi',
    custom: {
      storage: mongo.sessionAdapter,
      initial: createInitialSessionData,
    },
    conversation: {},
  }),
);

export const sessionComposer = (): Middleware<BotContextType> => composer;
