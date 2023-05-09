import { config } from '@bot/config';
import { gptModel } from '@bot/constants';
import {
  aboutController,
  adminController,
  descriptionController,
  newController,
  startController,
  textController,
  voiceController,
} from '@bot/controllers';
import { createInitialSessionData } from '@bot/helpers';
import {
  adminDynamicUsersForDeleteSessionsMenu,
  adminDynamicUsersForSessionsMenu,
  adminDynamicUsersMenu,
  adminLogsMenu,
  adminMainMenu,
  adminSessionsMenu,
  adminUsersMenu,
} from '@bot/menu';
import { auth, normalize } from '@bot/middlewares';
import { mongo } from '@bot/services';
import { BotContextType } from '@bot/types';
import { I18n } from '@grammyjs/i18n';
import { Bot, session } from 'grammy';
import path from 'path';

export const createBot = () => {
  const bot = new Bot<BotContextType>(config.TELEGRAM_TOKEN);

  const i18n = new I18n<BotContextType>({
    defaultLocale: 'en',
    useSession: true,
    directory: path.join(__dirname, './locales'),
    globalTranslationContext(ctx) {
      return {
        first_name: ctx.from?.first_name ?? '',
        username: ctx?.from?.username ?? '',
        model: gptModel,
      };
    },
  });

  adminMainMenu.register(adminSessionsMenu);
  adminMainMenu.register(adminUsersMenu);
  adminMainMenu.register(adminLogsMenu);
  adminMainMenu.register(adminDynamicUsersMenu);
  adminMainMenu.register(adminDynamicUsersForSessionsMenu);
  adminMainMenu.register(adminDynamicUsersForDeleteSessionsMenu);

  bot.use(i18n);

  bot.use(
    session({
      initial: createInitialSessionData,
      storage: mongo.sessionAdapter,
    }),
  );

  bot.use(auth());

  bot.use(normalize());

  bot.use(adminMainMenu);

  [
    aboutController,
    adminController,
    descriptionController,
    newController,
    startController,
    textController,
    voiceController,
  ].forEach((handle) => handle(bot));

  return bot;
};
