import { BotType } from '@bot/app/types';
import { BotCommand } from '@bot/common/constants';
import { resetSelectedModel } from '@bot/common/helpers';

export const startModule = (bot: BotType) =>
  bot.command(BotCommand.START, async (ctx) => {
    const messageId = Number(ctx.message?.message_id);

    ctx.session.selectedModel = resetSelectedModel();

    return ctx.reply(ctx.t('start-description'), {
      reply_to_message_id: messageId,
    });
  });
