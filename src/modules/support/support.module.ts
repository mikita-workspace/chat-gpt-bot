import { BotType } from '@bot/app/types';
import { BotCommands } from '@bot/common/constants';

export const supportModule = (bot: BotType) =>
  bot.command(BotCommands.SUPPORT, async (ctx) => {
    const messageId = Number(ctx.message?.message_id);

    // TODO: Will be implemented here: https://app.asana.com/0/1205877070000801/1205877070000832/f
    return ctx.reply(ctx.t('unavailable-section'), {
      reply_to_message_id: messageId,
    });
  });
