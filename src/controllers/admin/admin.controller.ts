import { adminMainMenu } from '@bot/menu';
import { BotType } from '@bot/types';

export const adminController = async (bot: BotType) => {
  bot.callbackQuery('admin-go-to-main-action', async (ctx) => {
    const firstName = ctx?.update?.callback_query?.from?.first_name ?? '';
    const botName = ctx?.me?.first_name ?? '';

    await ctx.deleteMessage();
    await ctx.reply(
      ctx.t('admin-initial', {
        firstName,
        botName,
      }),
      { reply_markup: adminMainMenu },
    );
  });

  bot.callbackQuery('admin-add-new-user-action', async (ctx) => {
    await ctx.deleteMessage();
    await ctx.conversation.enter('addUserConversation');
  });

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
