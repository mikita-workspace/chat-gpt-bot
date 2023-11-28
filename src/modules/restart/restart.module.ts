import { BotType } from '@bot/app/types';
import { BotCommand } from '@bot/common/constants';
import { resetSelectedModel } from 'common/helpers';

export const restartModule = (bot: BotType) =>
  bot.command(BotCommand.RESTART, async (ctx) => {
    const messageId = Number(ctx.message?.message_id);

    ctx.session.client.messages = [];
    ctx.session.selectedModel = resetSelectedModel();

    return ctx.reply(ctx.t('restart-message'), {
      reply_to_message_id: messageId,
    });
  });
