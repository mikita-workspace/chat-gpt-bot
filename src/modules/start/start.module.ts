import { BotType } from '@bot/app/types';
import { BotCommand, SELECTED_MODEL_KEY, TTL_SELECTED_MODEL_CACHE } from '@bot/common/constants';
import { createInitialClientSession, resetSelectedModel } from '@bot/common/helpers';
import { setValueToMemoryCache } from '@bot/common/utils';

export const startModule = (bot: BotType) =>
  bot.command(BotCommand.START, async (ctx) => {
    const messageId = Number(ctx.message?.message_id);

    await setValueToMemoryCache(
      SELECTED_MODEL_KEY,
      JSON.stringify(resetSelectedModel()),
      TTL_SELECTED_MODEL_CACHE,
    );

    ctx.session.client = createInitialClientSession();

    return ctx.reply(ctx.t('start-description'), {
      reply_to_message_id: messageId,
    });
  });
