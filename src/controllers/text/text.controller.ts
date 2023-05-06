import { getGPTAnswer } from '../../helpers';
import { BotType } from '../../types';

export const textController = (bot: BotType) => {
  bot.on('message:text', async (ctx) => {
    try {
      const messageId = Number(ctx?.message?.message_id);
      const text = String(ctx?.message?.text);
      const chatId = String(ctx?.chat?.id);

      const gptAnswer = (await getGPTAnswer(ctx, text)) ?? '';

      await ctx.api.sendMessage(chatId, gptAnswer, {
        reply_to_message_id: messageId,
      });
    } catch (error) {
      await ctx.reply(ctx.t('error-common'));
      console.error(
        `ERROR::Controller::textController::${(error as Error).message}`,
      );
    }
  });
};
