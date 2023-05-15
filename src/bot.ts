import { conversationComposer, i18nComposer, menuComposer, sessionComposer } from '@bot/composers';
import { config } from '@bot/config';
import {
  aboutController,
  adminController,
  descriptionController,
  newController,
  startController,
  textController,
  voiceController,
} from '@bot/controllers';
import { handleBotError } from '@bot/helpers';
import { auth, normalize } from '@bot/middlewares';
import { logger } from '@bot/services';
import { BotContextType } from '@bot/types';
import { Bot } from 'grammy';

export const createBot = () => {
  const bot = new Bot<BotContextType>(config.TELEGRAM_TOKEN);

  bot.use(i18nComposer());

  bot.use(sessionComposer());

  bot.use(conversationComposer());

  bot.use(menuComposer());

  bot.use(normalize());

  bot.use(auth());

  [
    aboutController,
    adminController,
    descriptionController,
    newController,
    startController,
    textController,
    voiceController,
  ].forEach((handle) => handle(bot));

  bot.catch(handleBotError);

  logger.info('test');
  logger.error('test');

  return bot;
};
