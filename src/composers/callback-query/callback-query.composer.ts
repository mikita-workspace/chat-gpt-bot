import { config } from '@bot/config';
import {
  AdminMenuActions,
  CommonActions,
  ModeratorMenuActions,
  TTL_DEFAULT,
  UserImagesMenuActions,
  UsersMenuActions,
} from '@bot/constants';
import {
  addMultipleUsersConversation,
  addUserConversation,
  createImageConversation,
} from '@bot/conversations';
import { adminMainMenu, moderatorMainMenu } from '@bot/menu';
import { BotContextType } from '@bot/types';
import { Composer, Middleware } from 'grammy';

const composer = new Composer<BotContextType>();

composer.callbackQuery(AdminMenuActions.GO_TO_MENU, async (ctx) => {
  await ctx.deleteMessage();

  await ctx.conversation.exit(addUserConversation.name);
  await ctx.conversation.exit(addMultipleUsersConversation.name);

  await ctx.reply(
    `${ctx.t('admin-panel-title')}\n\r\n\r${ctx.t('info-message-node-cache', {
      cache: TTL_DEFAULT / 60,
    })}`,
    { reply_markup: adminMainMenu },
  );
});

composer.callbackQuery(ModeratorMenuActions.GO_TO_MENU, async (ctx) => {
  await ctx.deleteMessage();

  await ctx.conversation.exit(addUserConversation.name);

  await ctx.reply(
    `${ctx.t('moderator-panel-title')}\n\r\n\r${ctx.t('info-message-node-cache', {
      cache: TTL_DEFAULT / 60,
    })}\n\r${
      config.SUPER_ADMIN_USER_ID === ctx.from?.id
        ? ctx.t('info-message-moderator-panel-for-super-admin')
        : ''
    }`,
    { reply_markup: moderatorMainMenu },
  );
});

composer.callbackQuery(UsersMenuActions.ADD_NEW_USER, async (ctx) => {
  await ctx.deleteMessage();

  await ctx.conversation.enter(addUserConversation.name);
});

composer.callbackQuery(UsersMenuActions.ADD_NEW_MULTIPLE_USERS, async (ctx) => {
  await ctx.deleteMessage();

  await ctx.conversation.enter(addMultipleUsersConversation.name);
});

composer.callbackQuery(CommonActions.GO_TO_CHAT, async (ctx) => {
  await ctx.conversation.exit(createImageConversation.name);

  await ctx.deleteMessage();
  await ctx.reply(ctx.t('start-message'));
});

composer.callbackQuery(UserImagesMenuActions.CREATE_IMAGE, async (ctx) => {
  await ctx.deleteMessage();

  await ctx.conversation.enter(createImageConversation.name);
});

export const callbackQueryComposer = (): Middleware<BotContextType> => composer;
