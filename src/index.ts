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

const bot = new Telegraf<BotContextType>(TELEGRAM_TOKEN);

bot.use(locale());

bot.use(auth([Number(process.env.ALLOW_USER)]));

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
