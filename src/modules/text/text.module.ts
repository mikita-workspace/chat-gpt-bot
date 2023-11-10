import { gptMessage } from '@bot/common/helpers';
import { inlineVoteButton } from '@bot/common/keyboards';
import { logger } from '@bot/services';
import { BotType } from '@bot/types';

export const textModule = (bot: BotType) => {
  bot.on('message:text', async (ctx) => {
    try {
      const messageId = Number(ctx.message.message_id);
      const selectedGptModel = ctx.session.client.selectedGptModel;

      const text = String(ctx?.message?.text);

      if (!text) {
        return await ctx.reply(ctx.t('error-message-gpt'), { reply_to_message_id: messageId });
      }

      const gptContent = await gptMessage(ctx, text, selectedGptModel);

      if (gptContent) {
        return await ctx.reply(gptContent, {
          reply_to_message_id: messageId,
          reply_markup: inlineVoteButton(ctx),
        });
      }

      return await ctx.reply(ctx.t('error-message-gpt'), { reply_to_message_id: messageId });
    } catch (error) {
      await ctx.reply(ctx.t('error-message-common'));

      logger.error(
        `src/modules/text/text.module.ts::textController::${JSON.stringify(error.message)}`,
      );
    }
  });
};
