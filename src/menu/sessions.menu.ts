import { deleteUserSessionMessagesCallback, getUserSessionMessagesCallback } from '@bot/callbacks';
import { SessionsMenu } from '@bot/constants';
import { dynamicUsersWithSessionMenuRange } from '@bot/helpers';
import { BotContextType } from '@bot/types';
import { Menu } from '@grammyjs/menu';

export const sessionsMenu = new Menu<BotContextType>(SessionsMenu.INITIAL)
  .submenu((ctx) => ctx.t('sessions-menu-button-get'), SessionsMenu.GET)
  .submenu((ctx) => ctx.t('sessions-menu-button-delete'), SessionsMenu.DELETE)
  .row()
  .back((ctx) => ctx.t('common-button-go-back'));

export const getUserSessionMenu = new Menu<BotContextType>(SessionsMenu.GET, {
  onMenuOutdated: false,
})
  .dynamic(async (ctx) => dynamicUsersWithSessionMenuRange(ctx, getUserSessionMessagesCallback))
  .text(
    (ctx) => ctx.t('common-button-cancel'),
    (ctx) => ctx.menu.nav(SessionsMenu.INITIAL),
  );

export const deleteUserSessionMenu = new Menu<BotContextType>(SessionsMenu.DELETE, {
  onMenuOutdated: false,
})
  .dynamic(async (ctx) =>
    dynamicUsersWithSessionMenuRange(ctx, deleteUserSessionMessagesCallback, false),
  )
  .back(
    (ctx) => ctx.t('common-button-cancel'),
    (ctx) => ctx.menu.nav(SessionsMenu.INITIAL),
  );
