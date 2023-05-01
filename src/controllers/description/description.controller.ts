import { BotType } from '../../types';

export const descriptionController = (bot: BotType) =>
  bot.command('description', async (ctx) => ctx.reply(ctx.t('description')));
