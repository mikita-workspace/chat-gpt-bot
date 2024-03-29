import { MODEL_GPT_DEFAULT } from '@bot/api/gpt/constants';
import { LocaleCode } from '@bot/common/constants';
import { handleBotError, mapBotCommands, mapBotDescription } from '@bot/common/helpers';
import {
  authQueryComposer,
  callbackQueryComposer,
  conversationComposer,
  publicConversationComposer,
  sessionComposer,
} from '@bot/composers';
import { config } from '@bot/config';
import { auth, normalize } from '@bot/middlewares';
import { aboutModule } from '@bot/modules/about';
import { changeModule } from '@bot/modules/change';
import { fileModule } from '@bot/modules/file';
import { imageModule } from '@bot/modules/image';
import { profileModule } from '@bot/modules/profile';
import { restartModule } from '@bot/modules/restart';
import { startModule } from '@bot/modules/start';
import { supportModule } from '@bot/modules/support';
import { textModule } from '@bot/modules/text';
import { voiceModule } from '@bot/modules/voice';
// import { autoRetry } from '@grammyjs/auto-retry';
import { hydrateFiles } from '@grammyjs/files';
import { hydrate } from '@grammyjs/hydrate';
import { I18n } from '@grammyjs/i18n';
import { limit as rateLimit } from '@grammyjs/ratelimiter';
import { apiThrottler } from '@grammyjs/transformer-throttler';
import { Bot } from 'grammy';
import * as path from 'path';

import { BotContextType } from './types';

export const createBot = () => {
  const bot = new Bot<BotContextType>(config.TELEGRAM_TOKEN);

  const i18n = new I18n<BotContextType>({
    defaultLocale: LocaleCode.ENGLISH,
    globalTranslationContext: (ctx) => ({
      firstName: ctx?.from?.first_name ?? '',
      lastName: ctx?.from?.last_name ?? '',
      model: MODEL_GPT_DEFAULT.model,
      username: ctx?.from?.username ?? '',
    }),
    directory: path.join(__dirname, '../locales'),
  });

  Object.values(LocaleCode).forEach(async (languageCode) => {
    await bot.api.setMyDescription(mapBotDescription(i18n, languageCode), {
      language_code: languageCode,
    });

    await bot.api.setMyCommands(mapBotCommands(i18n, languageCode), {
      language_code: languageCode,
    });
  });

  // bot.api.config.use(autoRetry());

  bot.api.config.use(apiThrottler());

  bot.api.config.use(hydrateFiles(config.TELEGRAM_TOKEN));

  bot.use(rateLimit());

  bot.use(hydrate());

  bot.use(i18n);

  bot.use(sessionComposer());

  bot.use(publicConversationComposer());

  bot.use(authQueryComposer());

  bot.use(auth());

  bot.use(normalize());

  bot.use(conversationComposer());

  bot.use(callbackQueryComposer());

  [
    aboutModule,
    changeModule,
    fileModule,
    imageModule,
    profileModule,
    restartModule,
    startModule,
    supportModule,
    textModule,
    voiceModule,
  ].forEach((handle) => handle(bot));

  bot.catch(handleBotError);

  return bot;
};
