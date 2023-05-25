import { AdminMenuActions, BotCommands, UsersMenuActions } from '@bot/constants';
import { addMultipleUsersConversation, addUserConversation } from '@bot/conversations';
import { adminMainMenu } from '@bot/menu';
import { BotType } from '@bot/types';

export const adminCommand = async (bot: BotType) => {
  bot.callbackQuery(AdminMenuActions.GO_TO_MENU, async (ctx) => {
    await ctx.deleteMessage();

    await ctx.conversation.exit(addUserConversation.name);
    await ctx.conversation.exit(addMultipleUsersConversation.name);

    await ctx.reply(ctx.t('admin-panel-title'), { reply_markup: adminMainMenu });
  });

  bot.callbackQuery(UsersMenuActions.ADD_NEW_USER, async (ctx) => {
    await ctx.deleteMessage();
    await ctx.conversation.enter(addUserConversation.name);
  });

  bot.callbackQuery(UsersMenuActions.ADD_NEW_MULTIPLE_USERS, async (ctx) => {
    await ctx.deleteMessage();
    await ctx.conversation.enter(addMultipleUsersConversation.name);
  });

  return bot.command(BotCommands.ADMIN, async (ctx) => {
    await ctx.reply(ctx.t('admin-panel-title'), { reply_markup: adminMainMenu });
  });
};
