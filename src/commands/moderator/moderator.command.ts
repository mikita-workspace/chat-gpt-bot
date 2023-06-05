import { config } from '@bot/config';
import { BotCommands, TTL_DEFAULT } from '@bot/constants';
import { moderatorMainMenu } from '@bot/menu';
import { BotType } from '@bot/types';

export const moderatorCommand = (bot: BotType) =>
  bot.command(BotCommands.MODERATOR, async (ctx) => {
    await ctx.reply(
      `${ctx.t('moderator-panel-title')}\n\r\n\r${ctx.t('info-message-node-cache', {
        cache: TTL_DEFAULT / 60,
      })}\n\r${
        config.SUPER_ADMIN_USER_ID === ctx.from?.id
          ? ctx.t('info-message-moderator-panel-for-super-admin')
          : ''
      }`,
      { reply_markup: moderatorMainMenu },
    );
  });
