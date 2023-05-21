import { AdminMenuActions, BotCommands, UsersMenuActions } from '@bot/constants';
import { addUserConversation } from '@bot/conversations';
import { adminMainMenu } from '@bot/menu';
import { BotType } from '@bot/types';

export const adminController = async (bot: BotType) => {
  bot.callbackQuery(AdminMenuActions.GO_TO_MENU, async (ctx) => {
    await ctx.deleteMessage();
    await ctx.conversation.exit(addUserConversation.name);
    await ctx.reply(ctx.t('admin-initial'), { reply_markup: adminMainMenu });
  });

  bot.callbackQuery(UsersMenuActions.ADD_NEW_USER, async (ctx) => {
    await ctx.deleteMessage();
    await ctx.conversation.enter(addUserConversation.name);
  });

  return bot.command(BotCommands.ADMIN, async (ctx) => {
    await ctx.reply(ctx.t('admin-initial'), { reply_markup: adminMainMenu });
  });
};
