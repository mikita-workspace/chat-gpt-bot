import { deleteUserSessionMessagesCallback, getUserSessionMessagesCallback } from '@bot/callbacks';
import { ModeratorMenu, SessionsMenu } from '@bot/constants';
import { dynamicUsersWithSessionMenuRange } from '@bot/helpers';
import { BotContextType } from '@bot/types';
import { Menu } from '@grammyjs/menu';

export const sessionsMenu = (menuName: string) => {
  if (menuName === ModeratorMenu.NAME) {
    return new Menu<BotContextType>(`${SessionsMenu.INITIAL}-${menuName}`)
      .submenu((ctx) => ctx.t('sessions-menu-button-get'), `${SessionsMenu.GET}-${menuName}`)
      .row()
      .back((ctx) => ctx.t('common-button-go-back'));
  }

  return new Menu<BotContextType>(`${SessionsMenu.INITIAL}-${menuName}`)
    .submenu((ctx) => ctx.t('sessions-menu-button-get'), `${SessionsMenu.GET}-${menuName}`)
    .submenu((ctx) => ctx.t('sessions-menu-button-delete'), `${SessionsMenu.DELETE}-${menuName}`)
    .row()
    .back((ctx) => ctx.t('common-button-go-back'));
};

export const getUserSessionMenu = (menuName: string) =>
  new Menu<BotContextType>(`${SessionsMenu.GET}-${menuName}`, {
    onMenuOutdated: false,
  })
    .dynamic(async (ctx) => dynamicUsersWithSessionMenuRange(ctx, getUserSessionMessagesCallback))
    .text(
      (ctx) => ctx.t('common-button-cancel'),
      (ctx) => ctx.menu.nav(`${SessionsMenu.INITIAL}-${menuName}`),
    );

export const deleteUserSessionMenu = (menuName: string) =>
  new Menu<BotContextType>(`${SessionsMenu.DELETE}-${menuName}`, {
    onMenuOutdated: false,
  })
    .dynamic(async (ctx) =>
      dynamicUsersWithSessionMenuRange(ctx, deleteUserSessionMessagesCallback, false),
    )
    .back(
      (ctx) => ctx.t('common-button-cancel'),
      (ctx) => ctx.menu.nav(`${SessionsMenu.INITIAL}-${menuName}`),
    );
