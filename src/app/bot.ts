import { ModelGPT } from '@bot/api/gpt/constants';
import { BotContextType } from '@bot/app/types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BotLanguageCodes, botName } from '@bot/common/constants';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { handleBotError, mapBotCommands, mapBotDescription } from '@bot/common/helpers';
import {
  authQueryComposer,
  callbackQueryComposer,
  conversationComposer,
  sessionComposer,
} from '@bot/composers';
import { config } from '@bot/config';
import { auth, normalize } from '@bot/middlewares';
import { changeModule } from '@bot/modules/change';
import { profileModule } from '@bot/modules/profile';
import { restartModule } from '@bot/modules/restart';
import { textModule } from '@bot/modules/text';
import { voiceModule } from '@bot/modules/voice';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { hydrate } from '@grammyjs/hydrate';
import { I18n } from '@grammyjs/i18n';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { limit as rateLimit } from '@grammyjs/ratelimiter';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { apiThrottler } from '@grammyjs/transformer-throttler';
import { Bot } from 'grammy';
import * as path from 'path';

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
    directory: path.join(__dirname, '../locales'),
    useSession: true,
  });

  // TODO: Will be enable in release-3.0.1
  // Object.values(BotLanguageCodes).forEach(async (languageCode) => {
  //   await bot.api.setMyDescription(mapBotDescription(i18n, languageCode), {
  //     language_code: languageCode,
  //   });

  //   await bot.api.setMyCommands(mapBotCommands(i18n, languageCode), {
  //     language_code: languageCode,
  //   });
  // });

  // bot.api.config.use(apiThrottler());

  // bot.use(rateLimit());

  // bot.use(hydrate());

  bot.use(i18n);

  bot.use(authQueryComposer());

  bot.use(auth());

  bot.use(sessionComposer());

  bot.use(conversationComposer());

  bot.use(callbackQueryComposer());

  bot.use(normalize());

  [restartModule, changeModule, profileModule, textModule, voiceModule].forEach((handle) =>
    handle(bot),
  );

  bot.catch(handleBotError);

  return bot;
};
