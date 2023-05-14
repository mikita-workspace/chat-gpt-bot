import { BotCommands } from '@bot/constants';
import { BotType } from '@bot/types';

export const startController = (bot: BotType) =>
  bot.command(BotCommands.START, async (ctx) => ctx.reply(ctx.t('bot-initial')));
