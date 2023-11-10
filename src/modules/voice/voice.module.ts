import { gptMessage } from '@bot/common/helpers';
import { logger } from '@bot/services';
import { BotType } from '@bot/types';
import { transcription } from 'api/gpt';
import { inlineVoteButton } from 'common/keyboards';

export const voiceModule = (bot: BotType) => {
  bot.on('message:voice', async (ctx) => {
    try {
      const telegramId = Number(ctx.message.from.id);
      const messageId = Number(ctx.message.message_id);
      const selectedGptModel = ctx.session.client.selectedGptModel;

      const voicePathApi = (await ctx.getFile()).file_path ?? '';
      const clientTranscription = await transcription(voicePathApi, telegramId);

      if (!clientTranscription) {
        return await ctx.reply(ctx.t('error-message-gpt'), { reply_to_message_id: messageId });
      }

      const gptContent = await gptMessage(ctx, clientTranscription, selectedGptModel);

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
        `src/modules/voice/voice.module.ts::voiceModule::${JSON.stringify(error.message)}`,
      );
    }
  });
};
