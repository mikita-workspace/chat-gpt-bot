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

// Bot initialization
const bot = new Telegraf<BotContextType>(TELEGRAM_TOKEN);

// TODO: implement session with MongoDB Atlas
// Local session
bot.use(new LocalSession({ database: 'sessions.json' }).middleware());

// Command actions
startCommand(bot);
newCommand(bot);
aboutCommand(bot);
descriptionCommand(bot);

// Message actions
textMessage(bot);
voiceMessage(bot);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
