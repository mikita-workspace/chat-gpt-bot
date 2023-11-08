import { BotCommands } from '@bot/constants';
import { BotType } from '@bot/types';

export const startCommand = (bot: BotType) =>
  bot.command(BotCommands.START, async (ctx) => {
    await ctx.reply(ctx.t('start-message'));
  });
