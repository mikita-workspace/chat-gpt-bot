import { transcription } from '@bot/api/gpt';
import { BotType } from '@bot/app/types';
import { getGptContent, gptLoader } from '@bot/common/helpers';
import { expiresInFormat, isExpiredDate } from '@bot/common/utils';
import { inlineFeedback } from '@bot/keyboards';
import { Logger } from '@bot/services';

export const voiceModule = (bot: BotType) => {
  bot.on('message:voice', async (ctx) => {
    try {
      const telegramId = Number(ctx.message?.from.id);
      const messageId = Number(ctx.message?.message_id);
      const locale = String(ctx.from?.language_code);

      const rate = ctx.session.client.rate;

      if (rate && !isExpiredDate(rate.expiresAt) && !rate.gptTokens) {
        return await ctx.reply(
          `${ctx.t('usage-token-limit', {
            expiresIn: expiresInFormat(rate.expiresAt, locale),
          })} ${ctx.t('support-contact')}`,
          { reply_to_message_id: messageId },
        );
      }

      const message = await gptLoader(ctx, messageId);

      const { speech: selectedSpeechModel } = ctx.session.client.selectedModel;

      const filename = (await ctx.getFile()).file_path ?? '';

      const clientTranscription = await transcription(
        filename,
        telegramId,
        selectedSpeechModel.model,
      );

      if (!clientTranscription) {
        return await message.editText(ctx.t('error-message-gpt'), {
          reply_to_message_id: messageId,
        });
      }

      const gptContent = await getGptContent(ctx, clientTranscription.text);

      if (gptContent) {
        return await message.editText(gptContent, {
          reply_to_message_id: messageId,
          reply_markup: inlineFeedback(ctx),
        });
      }

      return await message.editText(ctx.t('error-message-gpt'), {
        reply_to_message_id: messageId,
      });
    } catch (error) {
      await ctx.reply(ctx.t('error-message-common'));

      Logger.error(
        `src/modules/voice/voice.module.ts::voiceModule::${JSON.stringify(error.message)}`,
      );
    }
  });
};
