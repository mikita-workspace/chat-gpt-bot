import { BotType } from '@bot/types';

export const startController = (bot: BotType) =>
  bot.command('start', async (ctx) => ctx.reply(ctx.t('bot-initial')));
