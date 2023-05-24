import { BotCommands } from '@bot/constants';
import { BotType } from '@bot/types';

export const newCommand = (bot: BotType) =>
  bot.command(BotCommands.NEW, async (ctx) => ctx.reply(ctx.t('initial-message-start')));
