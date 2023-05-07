import { BotType } from '../../types';
import { adminMainMenu } from '../../menu';
import { addUserCallback } from '../../callbacks';
import { REGEXP_ADD_USER_INPUT } from '../../constants';

export const adminController = async (bot: BotType) => {
  bot.hears(REGEXP_ADD_USER_INPUT, addUserCallback);

  return bot.command('admin', async (ctx) => {
    const firstName = ctx?.update?.message?.from.first_name ?? '';
    const botName = ctx?.me?.first_name ?? '';

    await ctx.reply(
      ctx.t('admin-initial', {
        firstName,
        botName,
      }),
      { reply_markup: adminMainMenu },
    );
  });
};
