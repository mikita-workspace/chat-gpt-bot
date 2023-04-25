import { Telegraf } from 'telegraf';
import LocalSession from 'telegraf-session-local';
import { message } from 'telegraf/filters';
import { oggConverter, openAI } from './utils';
import {
  INITIAL_SESSION,
  MessageRoles,
  TELEGRAM_TOKEN,
  gptModel,
} from './constants';
import { BotContextType } from './types';

const bot = new Telegraf<BotContextType>(TELEGRAM_TOKEN);

// TODO: implement session with MongoDB Atlas
// Local session
bot.use(new LocalSession({ database: 'session/session.json' }).middleware());

// Command actions
bot.command('start', async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply('Waiting for a text or voice message...');
});

bot.command('new', async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply('Waiting for a text or voice message...');
});

bot.command('about', async (ctx) =>
  ctx.reply(
    `Built on the ${gptModel} architecture.\n\nhttps://github.com/mikita-kandratsyeu/telegram-bot`,
  ),
);

bot.command('description', async (ctx) => {
  ctx.reply(`Hi there 👋🏻\nI'm ChatGPT, an intelligent bot capable of responding to various user requests, including voice input. I'm built on the ${gptModel} architecture and possess extensive knowledge in various areas such as science, technology, arts, sports, health, business, and more. I can answer users' questions, help solve problems, and also engage in casual conversation on any topic. My interface allows for both text and voice input, making communication with me even more convenient and accessible for users.
  `);
});

// Message actions
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
