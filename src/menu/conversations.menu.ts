import {
  deleteUserConversationMessagesCallback,
  getUserConversationMessagesCallback,
} from '@bot/callbacks';
import { ConversationsMenu } from '@bot/constants';
import { dynamicUsersWithSessionMenuRange } from '@bot/helpers';
import { BotContextType } from '@bot/types';
import { Menu } from '@grammyjs/menu';

export const conversationsMenu = (menuName: string) =>
  new Menu<BotContextType>(`${ConversationsMenu.INITIAL}-${menuName}`)
    .submenu(
      (ctx) => ctx.t('conversations-menu-button-get'),
      `${ConversationsMenu.GET}-${menuName}`,
    )
    .submenu(
      (ctx) => ctx.t('conversations-menu-button-delete'),
      `${ConversationsMenu.DELETE}-${menuName}`,
    )
    .row()
    .back((ctx) => ctx.t('common-button-go-back'));

export const getUserConversationMenu = (menuName: string) =>
  new Menu<BotContextType>(`${ConversationsMenu.GET}-${menuName}`, {
    onMenuOutdated: false,
  })
    .dynamic(async (ctx) =>
      dynamicUsersWithSessionMenuRange(ctx, getUserConversationMessagesCallback),
    )
    .text(
      (ctx) => ctx.t('common-button-cancel'),
      (ctx) => ctx.menu.nav(`${ConversationsMenu.INITIAL}-${menuName}`),
    );

export const deleteUserConversationMenu = (menuName: string) =>
  new Menu<BotContextType>(`${ConversationsMenu.DELETE}-${menuName}`, {
    onMenuOutdated: false,
  })
    .dynamic(async (ctx) =>
      dynamicUsersWithSessionMenuRange(ctx, deleteUserConversationMessagesCallback, false),
    )
    .text(
      (ctx) => ctx.t('common-button-cancel'),
      (ctx) => ctx.menu.nav(`${ConversationsMenu.INITIAL}-${menuName}`),
    );
