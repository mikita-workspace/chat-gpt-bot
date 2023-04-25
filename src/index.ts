import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import { message } from 'telegraf/filters';
import { code } from 'telegraf/format';
import { oggConverter, openAI } from './utils';
import {
  commonErrorMessage,
  INITIAL_SESSION,
  MessageRoles,
  TELEGRAM_TOKEN,
} from './constants';
import { BotContextType } from './types';

const bot = new Telegraf<BotContextType>(TELEGRAM_TOKEN);

bot.use(new LocalSession({ database: 'session/session.json' }).middleware());

bot.command('new', async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply('Waiting for your voice or text message...');
});

bot.command('start', async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply('Waiting for your voice or text message...');
});

bot.on(message('text'), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;

  try {
    await ctx.reply(code('Waiting for answer from OpenAI...'));

    ctx.session.messages.push({
      role: MessageRoles.USER,
      content: ctx.message.text,
    });

    const response = await openAI.chat(ctx.session.messages);

    ctx.session.messages.push({
      role: MessageRoles.ASSISTANT,
      content: response?.content ?? '',
    });

    if (!response?.content) {
      await ctx.reply(code(commonErrorMessage));
      throw new Error('content is undefined');
    }

    await ctx.reply(response.content);
  } catch (error) {
    console.error(`ERROR::Listener::Voice::${(error as Error).message}`);
  }
});

bot.on(message('voice'), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;

  try {
    await ctx.reply(code('Waiting for answer from OpenAI...'));

    const userId = String(ctx.message.from.id);
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);

    const oggPath = await oggConverter.create(link.href, userId);

    if (!oggPath) {
      await ctx.reply(commonErrorMessage);
      throw new Error('oggPath is undefined');
    }

    const mp3Path = await oggConverter.toMp3(oggPath, userId);

    if (!mp3Path) {
      await ctx.reply(code(commonErrorMessage));
      throw new Error('mp3Path is undefined');
    }

    const text = await openAI.transcription(mp3Path);

    if (!text) {
      await ctx.reply(code(commonErrorMessage));
      throw new Error('text is undefined');
    }

    await ctx.reply(code(`You response: ${text}`));

    ctx.session.messages.push({ role: MessageRoles.USER, content: text });

    const response = await openAI.chat(ctx.session.messages);

    ctx.session.messages.push({
      role: MessageRoles.ASSISTANT,
      content: response?.content ?? '',
    });

    if (!response?.content) {
      await ctx.reply(code(commonErrorMessage));
      throw new Error('content is undefined');
    }

    await ctx.reply(response.content);
  } catch (error) {
    console.error(`ERROR::Listener::Voice::${(error as Error).message}`);
  }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
