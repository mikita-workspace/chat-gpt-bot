import { getGPTAnswer } from '../../helpers';
import { logger } from '../../services';
import { BotType } from '../../types';

export const textController = (bot: BotType) => {
  bot.on('message:text', async (ctx) => {
    try {
      const messageId = Number(ctx?.message?.message_id);
      const text = String(ctx?.message?.text);

      const gptAnswer = (await getGPTAnswer(ctx, text)) ?? '';

      await ctx.reply(gptAnswer, {
        reply_to_message_id: messageId,
      });
    } catch (error) {
      await ctx.reply(ctx.t('error-common'));

      logger.error(`controller::textController::${(error as Error).message}`);
    }
  });
};
