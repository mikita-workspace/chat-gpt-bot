import { BotCommands } from '@bot/constants';
import { adminMainMenu } from '@bot/menu';
import { BotType } from '@bot/types';

export const adminController = async (bot: BotType) => {
  bot.callbackQuery('admin-go-to-main-action', async (ctx) => {
    await ctx.deleteMessage();
    await ctx.conversation.exit('addUserConversation');
    await ctx.reply(ctx.t('admin-initial'), { reply_markup: adminMainMenu });
  });

  bot.callbackQuery('admin-add-new-user-action', async (ctx) => {
    await ctx.deleteMessage();
    await ctx.conversation.enter('addUserConversation');
  });

  return bot.command(BotCommands.ADMIN, async (ctx) => {
    await ctx.reply(ctx.t('admin-initial'), { reply_markup: adminMainMenu });
  });
};
