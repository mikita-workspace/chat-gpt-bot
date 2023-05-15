import { config } from '@bot/config';
import { gptModel, supportLanguageCodes } from '@bot/constants';
import {
  aboutController,
  adminController,
  descriptionController,
  newController,
  startController,
  textController,
  voiceController,
} from '@bot/controllers';
import { addUserConversation } from '@bot/conversations';
import { createInitialSessionData, mapBotCommands, mapBotDescription } from '@bot/helpers';
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
import { logger, mongo } from '@bot/services';
import { BotContextType } from '@bot/types';
import { conversations, createConversation } from '@grammyjs/conversations';
import { I18n } from '@grammyjs/i18n';
import { Bot, BotError, GrammyError, HttpError, session } from 'grammy';
import path from 'path';

const handleBotError = (error: BotError) => {
  const ctx = error.ctx;
  const err = error.error;

  logger.error(`botInitialize::error while handling update::${ctx.update.update_id}:`);

  if (err instanceof GrammyError) {
    logger.error(`botInitialize::error in request::${err.description}`);
  } else if (err instanceof HttpError) {
    logger.error(`botInitialize::could not contact Telegram::${err.message}`);
  } else {
    logger.error(`botInitialize::unknown error::${(err as Error).message}`);
  }
};

export const createBot = async () => {
  const bot = new Bot<BotContextType>(config.TELEGRAM_TOKEN);

  const i18n = new I18n<BotContextType>({
    defaultLocale: 'en',
    globalTranslationContext: (ctx) => ({
      botName: ctx?.me?.first_name ?? '',
      firstName: ctx?.from?.first_name ?? '',
      model: gptModel,
      username: ctx?.from?.username ?? '',
    }),
    directory: path.join(__dirname, './locales'),
    useSession: true,
  });

  supportLanguageCodes.forEach(async (languageCode) => {
    await bot.api.setMyDescription(mapBotDescription(i18n, languageCode), {
      language_code: languageCode,
    });

    await bot.api.setMyCommands(mapBotCommands(i18n, languageCode), {
      language_code: languageCode,
    });
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
      type: 'multi',
      custom: {
        storage: mongo.sessionAdapter,
        initial: createInitialSessionData,
      },
      conversation: {},
    }),
  );

  bot.use(auth());

  bot.use(normalize());

  bot.use(conversations());

  bot.use(createConversation(addUserConversation));

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

  bot.catch(handleBotError);

  return bot;
};
