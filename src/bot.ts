import path from 'path';
import { Bot, session } from 'grammy';
import { I18n } from '@grammyjs/i18n';
import { config } from './config';
import { createInitialSessionData, getHtmlForSessionMessages } from './helpers';
import {
  aboutController,
  descriptionController,
  newController,
  startController,
  textController,
  voiceController,
} from './controllers';
import { auth } from './middlewares';
import { mongo } from './services';
import { gptModel } from './constants';
import { BotContextType } from './types';

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

  bot.use(i18n);

  bot.use(auth());

  bot.use(
    session({
      initial: createInitialSessionData,
      storage: mongo.sessionAdapter,
    }),
  );

  // [
  //   aboutController,
  //   descriptionController,
  //   newController,
  //   startController,
  //   textController,
  //   voiceController,
  // ].forEach((handle) => handle(bot));

  bot.command('test', async (ctx) => {
    const msg = await mongo.getUserSessionMessages('495000805');

    console.log(getHtmlForSessionMessages());

    await ctx.api.sendMessage(
      ctx.chat.id,
      getHtmlForSessionMessages(msg, 'error'),
      {
        parse_mode: 'HTML',
      },
    );

    await ctx.reply(ctx.t('commonError'));
  });

  return bot;
};
