import { BotType } from '../../types';
import { gptModel } from '../../constants';

export const aboutController = (bot: BotType) =>
  bot.command('about', async (ctx) =>
    ctx.reply(ctx.t('about', { model: gptModel })),
  );
