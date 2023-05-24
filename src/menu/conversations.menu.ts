import {
  deleteUserConversationMessagesCallback,
  getUserConversationMessagesCallback,
} from '@bot/callbacks';
import { ConversationsMenu } from '@bot/constants';
import { dynamicUsersWithSessionMenuRange } from '@bot/helpers';
import { BotContextType } from '@bot/types';
import { Menu } from '@grammyjs/menu';

export const conversationsMenu = new Menu<BotContextType>(ConversationsMenu.INITIAL)
  .submenu((ctx) => ctx.t('conversations-menu-button-get'), ConversationsMenu.GET)
  .submenu((ctx) => ctx.t('conversations-menu-button-delete'), ConversationsMenu.DELETE)
  .row()
  .back((ctx) => ctx.t('common-button-go-back'));

export const getUserConversationMenu = new Menu<BotContextType>(ConversationsMenu.GET, {
  onMenuOutdated: false,
})
  .dynamic(async (ctx) =>
    dynamicUsersWithSessionMenuRange(ctx, getUserConversationMessagesCallback),
  )
  .text(
    (ctx) => ctx.t('common-button-cancel'),
    (ctx) => ctx.menu.nav(ConversationsMenu.INITIAL),
  );

export const deleteUserConversationMenu = new Menu<BotContextType>(ConversationsMenu.DELETE, {
  onMenuOutdated: false,
})
  .dynamic(async (ctx) =>
    dynamicUsersWithSessionMenuRange(ctx, deleteUserConversationMessagesCallback, false),
  )
  .text(
    (ctx) => ctx.t('common-button-cancel'),
    (ctx) => ctx.menu.nav(ConversationsMenu.INITIAL),
  );
