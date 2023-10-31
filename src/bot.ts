import {
  aboutCommand,
  adminCommand,
  clearCommand,
  descriptionCommand,
  imageCommand,
  moderatorCommand,
  profileCommand,
  startCommand,
  textCommand,
  voiceCommand,
} from '@bot/commands';
import {
  callbackQueryComposer,
  conversationComposer,
  menuComposer,
  sessionComposer,
} from '@bot/composers';
import { config } from '@bot/config';
import { botLanguageCodes, botName, ModelGPT } from '@bot/constants';
import { handleBotError, mapBotCommands, mapBotDescription } from '@bot/helpers';
import { auth, normalize } from '@bot/middlewares';
import { BotContextType } from '@bot/types';
import { hydrate } from '@grammyjs/hydrate';
import { I18n } from '@grammyjs/i18n';
import { limit as rateLimit } from '@grammyjs/ratelimiter';
import { apiThrottler } from '@grammyjs/transformer-throttler';
import { Bot } from 'grammy';
import path from 'path';

export const createBot = () => {
  const bot = new Bot<BotContextType>(config.TELEGRAM_TOKEN);

  const i18n = new I18n<BotContextType>({
    defaultLocale: 'en',
    globalTranslationContext: (ctx) => ({
      botName: ctx?.me?.first_name ?? botName,
      firstName: ctx?.from?.first_name ?? '',
      lastName: ctx?.from?.last_name ?? '',
      model: ModelGPT.GPT_3_5_TURBO,
      username: ctx?.from?.username ?? '',
    }),
    directory: path.join(__dirname, './locales'),
    useSession: true,
  });

  botLanguageCodes.forEach(async (languageCode) => {
    await bot.api.setMyDescription(mapBotDescription(i18n, languageCode), {
      language_code: languageCode,
    });

    await bot.api.setMyCommands(mapBotCommands(i18n, languageCode), {
      language_code: languageCode,
    });
  });

  bot.api.config.use(apiThrottler());

  bot.use(rateLimit());

  bot.use(hydrate());

  bot.use(i18n);

  bot.use(auth());

  bot.use(sessionComposer());

  bot.use(normalize());

  bot.use(conversationComposer());

  bot.use(menuComposer());

  bot.use(callbackQueryComposer());

  [
    aboutCommand,
    adminCommand,
    clearCommand,
    descriptionCommand,
    moderatorCommand,
    profileCommand,
    startCommand,
    imageCommand,
    textCommand,
    voiceCommand,
  ].forEach((handle) => handle(bot));

  bot.catch(handleBotError);

  return bot;
};
