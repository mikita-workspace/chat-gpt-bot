import { BotCommands } from '@bot/constants';
import { adminMainMenu } from '@bot/menu';
import { BotType } from '@bot/types';

export const adminCommand = async (bot: BotType) =>
  bot.command(BotCommands.ADMIN, async (ctx) => {
    await ctx.reply(ctx.t('admin-panel-title'), { reply_markup: adminMainMenu });
  });
