import mongoose from 'mongoose';
import { MONGODB_URI, TELEGRAM_TOKEN } from './constants';
import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import {
  aboutCommand,
  descriptionCommand,
  newCommand,
  startCommand,
  textMessage,
  voiceMessage,
} from './commands';
import { BotContextType } from './types';
import { auth, locale, normalize } from './middlewares';

const botInitialize = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    const bot = new Telegraf<BotContextType>(TELEGRAM_TOKEN);

    bot.use(new LocalSession({ database: 'session.json' }).middleware());

    bot.use(normalize());

    bot.use(locale());

    // bot.use(auth([process.env.ALLOW_USER ?? '']));

    [
      aboutCommand,
      descriptionCommand,
      newCommand,
      startCommand,
      textMessage,
      voiceMessage,
    ].forEach((handle) => handle(bot));
    bot.launch();

    console.info('INFO::botInitialize::MongoDB has been started');

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  } catch (error) {
    console.error(`ERROR::botInitialize::${(error as Error).message}`);
  }
};

botInitialize();
