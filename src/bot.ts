import {
  aboutCommand,
  adminCommand,
  descriptionCommand,
  moderatorCommand,
  newCommand,
  profileCommand,
  startCommand,
  textCommand,
  voiceCommand,
} from '@bot/commands';
import {
  callbackQueryComposer,
  conversationComposer,
  i18nComposer,
  menuComposer,
  sessionComposer,
} from '@bot/composers';
import { config } from '@bot/config';
import { handleBotError } from '@bot/helpers';
import { auth, normalize } from '@bot/middlewares';
import { BotContextType } from '@bot/types';
import { hydrate } from '@grammyjs/hydrate';
import { limit as rateLimit } from '@grammyjs/ratelimiter';
import { apiThrottler } from '@grammyjs/transformer-throttler';
import { Bot } from 'grammy';

export const createBot = () => {
  const bot = new Bot<BotContextType>(config.TELEGRAM_TOKEN);

  bot.api.config.use(apiThrottler());

  bot.use(rateLimit());

  bot.use(hydrate());

  bot.use(i18nComposer());

  bot.use(auth());

  bot.use(sessionComposer());

  bot.use(normalize());

  bot.use(conversationComposer());

  bot.use(menuComposer());

  bot.use(callbackQueryComposer());

  [
    aboutCommand,
    adminCommand,
    descriptionCommand,
    moderatorCommand,
    newCommand,
    profileCommand,
    startCommand,
    textCommand,
    voiceCommand,
  ].forEach((handle) => handle(bot));

  bot.catch(handleBotError);

  return bot;
};
