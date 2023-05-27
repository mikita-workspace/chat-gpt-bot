import { BotCommands } from '@bot/constants';
import { moderatorMainMenu } from '@bot/menu';
import { BotType } from '@bot/types';

export const moderatorCommand = (bot: BotType) =>
  bot.command(BotCommands.MODERATOR, async (ctx) => {
    await ctx.reply(ctx.t('moderator-panel-title'), { reply_markup: moderatorMainMenu });
  });
