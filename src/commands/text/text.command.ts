import { updateUserConversationMessagesCallback } from '@bot/callbacks';
import { TEN_MIN_MS } from '@bot/constants';
import { getGPTAnswer } from '@bot/helpers';
import { inlineShareWithContacts } from '@bot/keyboards';
import { logger } from '@bot/services';
import { BotType } from '@bot/types';

export const textCommand = (bot: BotType) => {
  bot.on('message:text', async (ctx) => {
    try {
      const messageId = Number(ctx?.message?.message_id);
      const text = String(ctx?.message?.text);
      const username = String(ctx?.from?.username);

      // const currentTimestamp = Date.now();
      // const lastMessageTimestamp = Math.min(
      //   ...ctx.session.client.messages.map(({ timestamp }) => new Date(timestamp).getTime()),
      // );

      // if (Math.abs(currentTimestamp - lastMessageTimestamp) >= TEN_MIN_MS) {
      //   updateUserConversationMessagesCallback(ctx, username);
      // }

      const gptAnswer = (await getGPTAnswer(ctx, text)) ?? '';

      await ctx.reply(gptAnswer, {
        reply_to_message_id: messageId,
        reply_markup: inlineShareWithContacts(ctx, gptAnswer),
      });
    } catch (error) {
      await ctx.reply(ctx.t('error-message-common'));

      logger.error(`controller::textController::${JSON.stringify(error.message)}`);
    }
  });
};
