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
import { TELEGRAM_TOKEN } from './constants';
import { BotContextType } from './types';
import { auth, locale } from './middlewares';

// TODO: Move it to MongoDB as well
const allowUsers = [Number(process.env.ALLOW_USER)];

const bot = new Telegraf<BotContextType>(TELEGRAM_TOKEN);

bot.use(locale());

bot.use(auth(allowUsers));

bot.use(new LocalSession({ database: 'sessions.json' }).middleware());

[
  aboutCommand,
  descriptionCommand,
  newCommand,
  startCommand,
  textMessage,
  voiceMessage,
].forEach((handle) => handle(bot));

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
