import { config } from '@bot/config';
import { ModelGPT } from '@bot/constants';
import { getFileTelegramApiLink, getGPTAnswer } from '@bot/helpers';
import { inlineShareWithContacts } from '@bot/keyboards';
import { logger, oggConverter, openAI } from '@bot/services';
import { BotType } from '@bot/types';

export const voiceCommand = (bot: BotType) => {
  bot.on('message:voice', async (ctx) => {
    try {
      const currentGptModel = ctx.session.settings.selectedGPTModel;

      if (currentGptModel === ModelGPT.GIGA_CHAT) {
        return await ctx.reply(ctx.t('error-message-support-gpt-model'));
      }

      const userId = String(ctx.message.from.id);
      const messageId = Number(ctx.message.message_id);

      const voiceFile = await ctx.getFile();
      const voiceFileApiLink = getFileTelegramApiLink(
        config.TELEGRAM_TOKEN,
        voiceFile.file_path ?? '',
      );

      const oggPath = (await oggConverter.create(voiceFileApiLink, userId)) ?? '';
      const mp3Path = (await oggConverter.toMp3(oggPath, userId)) ?? '';

      const text = (await openAI.transcription(mp3Path)) ?? '';
      const gptAnswer = (await getGPTAnswer(ctx, text)) ?? '';

      await ctx.reply(gptAnswer, {
        reply_to_message_id: messageId,
        reply_markup: inlineShareWithContacts(ctx, gptAnswer),
      });
    } catch (error) {
      await ctx.reply(ctx.t('error-message-common'));

      logger.error(`controller::voiceController::${JSON.stringify(error.message)}`);
    }
  });
};
