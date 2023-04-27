import { message } from 'telegraf/filters';
import { oggConverter, openAI, i18n } from '../services';
import { BotType } from '../types';
import { INITIAL_SESSION, MessageRoles } from '../constants';

export const textMessage = (bot: BotType) => {
  bot.on(message('text'), async (ctx) => {
    ctx.session ??= INITIAL_SESSION;

    try {
      const messageId = Number(ctx.message.message_id);
      const chatId = String(ctx.chat.id);

      ctx.session.messages.push({
        role: MessageRoles.USER,
        content: ctx.message.text,
      });

      const response = await openAI.chat(ctx.session.messages);

      ctx.session.messages.push({
        role: MessageRoles.ASSISTANT,
        content: response?.content ?? '',
      });

      await ctx.telegram.sendMessage(chatId, response?.content ?? '', {
        reply_to_message_id: messageId,
      });
    } catch (error) {
      await ctx.reply(i18n.translate('commonError'));
      console.error(`ERROR::Listener::Voice::${(error as Error).message}`);
    }
  });
};

export const voiceMessage = (bot: BotType) => {
  bot.on(message('voice'), async (ctx) => {
    ctx.session ??= INITIAL_SESSION;

    try {
      const userId = String(ctx.message.from.id);
      const messageId = Number(ctx.message.message_id);
      const chatId = String(ctx.chat.id);

      const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);

      const oggPath = await oggConverter.create(link.href, userId);
      const mp3Path = await oggConverter.toMp3(oggPath ?? '', userId);

      const text = await openAI.transcription(mp3Path ?? '');

      ctx.session.messages.push({
        role: MessageRoles.USER,
        content: text ?? '',
      });

      const response = await openAI.chat(ctx.session.messages);

      ctx.session.messages.push({
        role: MessageRoles.ASSISTANT,
        content: response?.content ?? '',
      });

      await ctx.telegram.sendMessage(chatId, response?.content ?? '', {
        reply_to_message_id: messageId,
      });
    } catch (error) {
      await ctx.reply(i18n.translate('commonError'));
      console.error(`ERROR::Listener::Voice::${(error as Error).message}`);
    }
  });
};
