import { BotType } from '../../types';

export const aboutController = (bot: BotType) =>
  bot.command('about', async (ctx) => ctx.reply(ctx.t('bot-about')));
