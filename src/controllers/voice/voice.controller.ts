import { config } from '../../config';
import { oggConverter, openAI } from '../../services';
import { getFileApiLink, getGPTAnswer } from '../../helpers';
import { BotType } from '../../types';

export const voiceController = (bot: BotType) => {
  bot.on('message:voice', async (ctx) => {
    try {
      const userId = String(ctx.message.from.id);
      const messageId = Number(ctx.message.message_id);
      const chatId = String(ctx.chat.id);

      const voiceFile = await ctx.api.getFile(ctx.message.voice.file_id);
      const voiceFileApiLink = getFileApiLink(
        config.TELEGRAM_TOKEN,
        voiceFile.file_path,
      );

      const oggPath = await oggConverter.create(voiceFileApiLink, userId);
      const mp3Path = await oggConverter.toMp3(oggPath, userId);

      const text = await openAI.transcription(mp3Path);
      const gptAnswer = (await getGPTAnswer(ctx, text)) ?? '';

      await ctx.api.sendMessage(chatId, gptAnswer, {
        reply_to_message_id: messageId,
      });
    } catch (error) {
      await ctx.reply(ctx.t('commonError'));
      console.error(
        `ERROR::Controller::voiceController::${(error as Error).message}`,
      );
    }
  });
};
