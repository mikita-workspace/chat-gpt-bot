import { MessageRolesGPT } from '@bot/api/gpt/constants';
import { config } from '@bot/config';
import { ModelGPT } from '@bot/constants';
import { getFileTelegramApiLink, getGPTAnswer } from '@bot/helpers';
import { inlineShareWithContacts } from '@bot/keyboards';
import { logger, oggConverter, openAI } from '@bot/services';
import { BotType } from '@bot/types';
import { chatCompletion, transcription } from 'api/gpt';

export const voiceCommand = (bot: BotType) => {
  bot.on('message:voice', async (ctx) => {
    try {
      const telegramId = Number(ctx.message.from.id);
      const messageId = Number(ctx.message.message_id);
      const selectedGptModel = ctx.session.client.selectedGptModel;

      if (!selectedGptModel) {
        return await ctx.reply('GPT model does not select! /select');
      }

      const voicePathApi = (await ctx.getFile()).file_path ?? '';
      const clientTranscription = await transcription(voicePathApi, telegramId);

      if (!clientTranscription) {
        return await ctx.reply('неуддлось обработать сообшение');
      }

      ctx.session.client.messages.push({
        content: clientTranscription,
        role: MessageRolesGPT.USER,
      });

      const gptAnswer = await chatCompletion(selectedGptModel, ctx.session.client.messages);

      if (gptAnswer) {
        const content = gptAnswer.message.content;

        ctx.session.client.messages.push({
          content,
          role: MessageRolesGPT.ASSISTANT,
        });

        return await ctx.reply(content);
      }

      return await ctx.reply('неуддлось обработать сообшение');
    } catch (error) {
      await ctx.reply(ctx.t('error-message-common'));

      logger.error(`controller::voiceController::${JSON.stringify(error.message)}`);
    }
  });
};
