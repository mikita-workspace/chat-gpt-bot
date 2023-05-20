import { deleteUserSessionMessagesCallback, getUserSessionMessagesCallback } from '@bot/callbacks';
import { SessionsMenu } from '@bot/constants';
import { dynamicUsersWithSessionMenuRange } from '@bot/helpers';
import { BotContextType } from '@bot/types';
import { Menu } from '@grammyjs/menu';

export const sessionsMenu = new Menu<BotContextType>(SessionsMenu.INITIAL)
  .submenu((ctx) => ctx.t('admin-get-session'), SessionsMenu.GET)
  .submenu((ctx) => ctx.t('admin-delete-session'), SessionsMenu.DELETE)
  .row()
  .back((ctx) => ctx.t('admin-go-back'));

export const getUserSessionMenu = new Menu<BotContextType>(SessionsMenu.GET)
  .dynamic(async (ctx) => dynamicUsersWithSessionMenuRange(ctx, getUserSessionMessagesCallback))
  .text(
    (ctx) => ctx.t('admin-cancel'),
    (ctx) => ctx.menu.nav(SessionsMenu.INITIAL),
  );

export const deleteUserSessionMenu = new Menu<BotContextType>(SessionsMenu.DELETE)
  .dynamic(async (ctx) =>
    dynamicUsersWithSessionMenuRange(ctx, deleteUserSessionMessagesCallback, false),
  )
  .back(
    (ctx) => ctx.t('admin-cancel'),
    (ctx) => ctx.menu.nav(SessionsMenu.INITIAL),
  );
