import { BotType } from '../../types';

export const aboutController = (bot: BotType) =>
  bot.command('admin', async (ctx) => ctx.reply(ctx.t('about')));
