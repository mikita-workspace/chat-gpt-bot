import { BotType } from '@bot/app/types';
import { BotCommand } from '@bot/common/constants';

export const restartModule = (bot: BotType) =>
  bot.command(BotCommand.RESTART, async (ctx) => {
    const messageId = Number(ctx.message?.message_id);

    ctx.session.client.messages = [];

    return ctx.reply(ctx.t('restart-message'), {
      reply_to_message_id: messageId,
    });
  });
