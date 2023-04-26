import { i18n } from '../services';
import { INITIAL_SESSION, gptModel } from '../constants';
import { BotType } from '../types';

export const startCommand = (bot: BotType) => {
  bot.command('start', async (ctx) => {
    i18n.setLocale(ctx.from.language_code);

    ctx.session = INITIAL_SESSION;
    await ctx.reply(i18n.translate('initial'));
  });
};

export const newCommand = (bot: BotType) => {
  bot.command('new', async (ctx) => {
    i18n.setLocale(ctx.from.language_code);

    ctx.session = INITIAL_SESSION;
    await ctx.reply(i18n.translate('initial'));
  });
};

export const aboutCommand = (bot: BotType) => {
  bot.command('about', async (ctx) => {
    i18n.setLocale(ctx.from.language_code);

    ctx.reply(i18n.translate('about', { model: gptModel }));
  });
};

export const descriptionCommand = (bot: BotType) => {
  bot.command('description', async (ctx) => {
    i18n.setLocale(ctx.from.language_code);

    ctx.reply(i18n.translate('description', { model: gptModel }));
  });
};
