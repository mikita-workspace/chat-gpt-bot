import { getGPTMessage } from '../../helpers';
import { BotType } from '../../types';

export const textController = (bot: BotType) => {
  bot.on('message:text', async (ctx) => {
    try {
      const messageId = Number(ctx?.message?.message_id);
      const text = String(ctx?.message?.text);
      const chatId = String(ctx?.chat?.id);

      const gptMessage = (await getGPTMessage(ctx, text)) ?? '';

      await ctx.api.sendMessage(chatId, gptMessage, {
        reply_to_message_id: messageId,
      });
    } catch (error) {
      await ctx.reply(ctx.t('commonError'));
      console.error(
        `ERROR::Controller::textController::${(error as Error).message}`,
      );
    }
  });
};
