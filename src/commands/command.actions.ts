import { INITIAL_SESSION, gptModel } from '../constants';
import { BotType } from '../types';

export const startCommand = (bot: BotType) => {
  bot.command('start', async (ctx) => {
    ctx.session = INITIAL_SESSION;
    await ctx.reply('Waiting for a text or voice message...');
  });
};

export const newCommand = (bot: BotType) => {
  bot.command('new', async (ctx) => {
    ctx.session = INITIAL_SESSION;
    await ctx.reply('Waiting for a text or voice message...');
  });
};

export const aboutCommand = (bot: BotType) => {
  bot.command('about', async (ctx) =>
    ctx.reply(
      `Built on the ${gptModel} architecture.\n\nhttps://github.com/mikita-kandratsyeu/telegram-bot`,
    ),
  );
};

export const descriptionCommand = (bot: BotType) => {
  bot.command('description', async (ctx) => {
    ctx.reply(`I'm ChatGPT, an intelligent bot capable of responding to various user requests, including voice input. I'm built on the ${gptModel} architecture and possess extensive knowledge in various areas such as science, technology, arts, sports, health, business, and more. I can answer users' questions, help solve problems, and also engage in casual conversation on any topic. My interface allows for both text and voice input, making communication with me even more convenient and accessible for users.
    `);
  });
};
