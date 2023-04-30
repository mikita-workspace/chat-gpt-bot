import { BotType } from '../../types';
import { gptModel } from '../../constants';

export const descriptionController = (bot: BotType) =>
  bot.command('description', async (ctx) =>
    ctx.reply(ctx.t('description', { model: gptModel })),
  );
