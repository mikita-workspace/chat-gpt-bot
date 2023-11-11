import { BotType } from '@bot/app/types';
import { BotCommands } from '@bot/common/constants';

export const restartModule = (bot: BotType) =>
  bot.command(BotCommands.RESTART, async (ctx) => {
    const messageId = Number(ctx.message?.message_id);

    ctx.session.client.messages = [];

    return ctx.reply(ctx.t('restart-message'), {
      reply_to_message_id: messageId,
    });
  });
