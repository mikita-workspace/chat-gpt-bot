import { AdminMenuActions, ModeratorMenuActions, UsersMenuActions } from '@bot/constants';
import { addMultipleUsersConversation, addUserConversation } from '@bot/conversations';
import { adminMainMenu, moderatorMainMenu } from '@bot/menu';
import { BotContextType } from '@bot/types';
import { Composer, Middleware } from 'grammy';

const composer = new Composer<BotContextType>();

composer.callbackQuery(AdminMenuActions.GO_TO_MENU, async (ctx) => {
  await ctx.deleteMessage();

  await ctx.conversation.exit(addUserConversation.name);
  await ctx.conversation.exit(addMultipleUsersConversation.name);

  await ctx.reply(ctx.t('admin-panel-title'), { reply_markup: adminMainMenu });
});

composer.callbackQuery(ModeratorMenuActions.GO_TO_MENU, async (ctx) => {
  await ctx.deleteMessage();

  await ctx.conversation.exit(addUserConversation.name);

  await ctx.reply(ctx.t('moderator-panel-title'), { reply_markup: moderatorMainMenu });
});

composer.callbackQuery(UsersMenuActions.ADD_NEW_USER, async (ctx) => {
  await ctx.deleteMessage();
  await ctx.conversation.enter(addUserConversation.name);
});

composer.callbackQuery(UsersMenuActions.ADD_NEW_MULTIPLE_USERS, async (ctx) => {
  await ctx.deleteMessage();
  await ctx.conversation.enter(addMultipleUsersConversation.name);
});

export const callbackQueryComposer = (): Middleware<BotContextType> => composer;
