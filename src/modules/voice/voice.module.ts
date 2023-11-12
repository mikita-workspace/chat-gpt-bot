import { transcription } from '@bot/api/gpt';
import { BotType } from '@bot/app/types';
import { getGptContent, gptLoader } from '@bot/common/helpers';
import { inlineFeedback } from '@bot/keyboards';
import { Logger } from '@bot/services';

export const voiceModule = (bot: BotType) => {
  bot.on('message:voice', async (ctx) => {
    try {
      const telegramId = Number(ctx.message?.from.id);
      const messageId = Number(ctx.message?.message_id);

      const startMessage = await gptLoader(ctx, messageId);

      const { speech: selectedSpeechModel } = ctx.session.client.selectedModel;

      const voicePathApi = (await ctx.getFile()).file_path ?? '';
      const clientTranscription = await transcription(
        voicePathApi,
        telegramId,
        selectedSpeechModel.model,
      );

      if (!clientTranscription) {
        return await startMessage.editText(ctx.t('error-message-gpt'), {
          reply_to_message_id: messageId,
        });
      }

      const gptContent = await getGptContent(ctx, clientTranscription);

      if (gptContent) {
        return await startMessage.editText(gptContent, {
          reply_to_message_id: messageId,
          reply_markup: inlineFeedback(ctx),
        });
      }

      return await startMessage.editText(ctx.t('error-message-gpt'), {
        reply_to_message_id: messageId,
      });
    } catch (error) {
      await ctx.deleteMessage();
      await ctx.reply(ctx.t('error-message-common'));

      Logger.error(
        `src/modules/voice/voice.module.ts::voiceModule::${JSON.stringify(error.message)}`,
      );
    }
  });
};
