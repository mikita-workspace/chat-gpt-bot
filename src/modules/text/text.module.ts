import { BotType } from '@bot/app/types';
import { getGptContent } from '@bot/common/helpers';
import { inlineFeedback } from '@bot/keyboards';
import { Logger } from '@bot/services';

export const textModule = (bot: BotType) => {
  bot.on('message:text', async (ctx) => {
    try {
      const messageId = Number(ctx.message?.message_id);

      const text = String(ctx.message?.text);

      if (!text) {
        return await ctx.reply(ctx.t('error-message-gpt'), { reply_to_message_id: messageId });
      }

      const gptContent = await getGptContent(ctx, text);

      if (gptContent) {
        return await ctx.reply(gptContent, {
          reply_to_message_id: messageId,
          reply_markup: inlineFeedback(ctx),
        });
      }

      return await ctx.reply(ctx.t('error-message-gpt'), { reply_to_message_id: messageId });
    } catch (error) {
      await ctx.reply(ctx.t('error-message-common'));

      Logger.error(
        `src/modules/text/text.module.ts::textController::${JSON.stringify(error.message)}`,
      );
    }
  });
};
