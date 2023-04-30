import path from 'path';
import mongoose from 'mongoose';
import { Bot, session } from 'grammy';
import { I18n } from '@grammyjs/i18n';
import { MongoDBAdapter, ISession } from '@grammyjs/storage-mongodb';
import { createInitialSessionData } from './helpers';
import {
  aboutController,
  descriptionController,
  newController,
  startController,
  textController,
  voiceController,
} from './controllers';
import { TELEGRAM_TOKEN } from './constants';
import { BotContextType } from './types';

export const createBot = (db: typeof mongoose) => {
  const bot = new Bot<BotContextType>(TELEGRAM_TOKEN);

  const i18n = new I18n<BotContextType>({
    defaultLocale: 'en',
    useSession: true,
    directory: path.join(__dirname, './locales'),
    globalTranslationContext(ctx) {
      return {
        first_name: ctx.from?.first_name ?? '',
      };
    },
  });

  const collection = db.connection.db.collection<ISession>('sessions');

  bot.use(i18n);

  // bot.use(auth([process.env.ALLOW_USER ?? '']));

  bot.use(
    session({
      initial: createInitialSessionData,
      storage: new MongoDBAdapter({ collection }),
    }),
  );

  [
    aboutController,
    descriptionController,
    newController,
    startController,
    textController,
    voiceController,
  ].forEach((handle) => handle(bot));

  return bot;
};
