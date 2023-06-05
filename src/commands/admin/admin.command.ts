import { BotCommands, TTL_DEFAULT } from '@bot/constants';
import { adminMainMenu } from '@bot/menu';
import { BotType } from '@bot/types';

export const adminCommand = async (bot: BotType) =>
  bot.command(BotCommands.ADMIN, async (ctx) => {
    await ctx.reply(
      `${ctx.t('admin-panel-title')}\n\r\n\r${ctx.t('info-message-node-cache', {
        cache: TTL_DEFAULT / 60,
      })}`,
      { reply_markup: adminMainMenu },
    );
  });
