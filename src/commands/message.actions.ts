import { message } from 'telegraf/filters';
import { oggConverter, openAI, i18n } from '../services';
import { BotContextType, BotType } from '../types';
import { MessageRoles } from '../constants';
import { convertGPTMessage } from '../utils';

const getGPTMessage = async (ctx: BotContextType, text = '') => {
  try {
    ctx.session.messages.push(convertGPTMessage(text));

    const response = await openAI.chat(ctx.session.messages);

    if (!response) {
      await ctx.reply('Error');

      return '';
    }

    ctx.session.messages.push(
      convertGPTMessage(response.content, MessageRoles.ASSISTANT),
    );

    return response.content;
  } catch (error) {
    console.error(`ERROR::Listener::gptProcess::${(error as Error).message}`);
  }
};

export const textMessage = (bot: BotType) => {
  bot.on(message('text'), async (ctx) => {
    try {
      const messageId = Number(ctx?.message?.message_id);
      const text = String(ctx?.message?.text);
      const chatId = String(ctx?.chat?.id);

      const gptMessage = (await getGPTMessage(ctx, text)) ?? '';

      await ctx.telegram.sendMessage(chatId, gptMessage, {
        reply_to_message_id: messageId,
      });
    } catch (error) {
      await ctx.reply(i18n.translate('commonError'));
      console.error(
        `ERROR::Listener::textMessage::${(error as Error).message}`,
      );
    }
  });
};

export const voiceMessage = (bot: BotType) => {
  bot.on(message('voice'), async (ctx) => {
    try {
      const userId = String(ctx.message.from.id);
      const messageId = Number(ctx.message.message_id);
      const chatId = String(ctx.chat.id);

      const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
      const oggPath = await oggConverter.create(link.href, userId);
      const mp3Path = await oggConverter.toMp3(oggPath, userId);

      const text = await openAI.transcription(mp3Path);
      const gptMessage = (await getGPTMessage(ctx, text)) ?? '';

      await ctx.telegram.sendMessage(chatId, gptMessage, {
        reply_to_message_id: messageId,
      });
    } catch (error) {
      await ctx.reply(i18n.translate('commonError'));
      console.error(
        `ERROR::Listener::voiceMessage::${(error as Error).message}`,
      );
    }
  });
};
