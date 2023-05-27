import { config } from '@bot/config';
import { BotCommands } from '@bot/constants';
import { moderatorMainMenu } from '@bot/menu';
import { BotType } from '@bot/types';

export const moderatorCommand = (bot: BotType) =>
  bot.command(BotCommands.MODERATOR, async (ctx) => {
    await ctx.reply(
      `${ctx.t('moderator-panel-title')}` +
        `${
          config.SUPER_ADMIN_USERNAME === ctx.from?.username
            ? `\n\r\n\r${ctx.t('info-message-moderator-panel-for-super-admin')}`
            : ''
        }`,
      { reply_markup: moderatorMainMenu },
    );
  });
