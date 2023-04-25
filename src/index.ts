import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import { message } from 'telegraf/filters';
import { code } from 'telegraf/format';
import { oggConverter, openAI } from './utils';
import { INITIAL_SESSION, MessageRoles, TELEGRAM_TOKEN } from './constants';
import { BotContextType } from './types';

const bot = new Telegraf<BotContextType>(TELEGRAM_TOKEN);

bot.use(new LocalSession({ database: 'session/session.json' }).middleware());

bot.command('start', async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply('Waiting for a text or voice message...');
});

bot.command('new', async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply('Waiting for a text or voice message...');
});

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
    console.error(`ERROR::Listener::Voice::${(error as Error).message}`);
  }
});

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

    ctx.session.messages.push({ role: MessageRoles.USER, content: text ?? '' });

    const response = await openAI.chat(ctx.session.messages);

    ctx.session.messages.push({
      role: MessageRoles.ASSISTANT,
      content: response?.content ?? '',
    });

    await ctx.telegram.sendMessage(chatId, response?.content ?? '', {
      reply_to_message_id: messageId,
    });
  } catch (error) {
    await ctx.reply('Something went wrong. Try again!');
    console.error(`ERROR::Listener::Voice::${(error as Error).message}`);
  }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
