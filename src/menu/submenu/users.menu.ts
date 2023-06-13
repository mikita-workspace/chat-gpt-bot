import {
  addMultipleUsersCallback,
  addUserInitialCallback,
  blockUnblockUserCallback,
  changeUserGptLimitsCallback,
  changeUserRoleCallback,
  deleteUserCallback,
  getAllUsersCallback,
} from '@bot/callbacks';
import { ModeratorMenu, UsersMenu } from '@bot/constants';
import {
  dynamicNewGptLimitsMenuRange,
  dynamicUserRolesMenuRange,
  dynamicUsersMenuRange,
} from '@bot/helpers';
import { BotContextType } from '@bot/types';
import { Menu } from '@grammyjs/menu';

export const usersMenu = (menuName: string) => {
  if (menuName === ModeratorMenu.NAME) {
    return new Menu<BotContextType>(`${UsersMenu.INITIAL}-${menuName}`)
      .text(
        (ctx) => ctx.t('users-menu-button-get-all'),
        (ctx) => getAllUsersCallback(ctx),
      )
      .row()
      .text(
        (ctx) => ctx.t('users-menu-button-add'),
        (ctx) => addUserInitialCallback(ctx),
      )
      .row()
      .submenu(
        (ctx) => ctx.t('users-menu-button-block-unblock'),
        `${UsersMenu.BLOCK_UNBLOCK}-${menuName}`,
      )
      .row()

      .back((ctx) => ctx.t('common-button-go-back'));
  }

  return new Menu<BotContextType>(`${UsersMenu.INITIAL}-${menuName}`)
    .text(
      (ctx) => ctx.t('users-menu-button-get-all'),
      (ctx) => getAllUsersCallback(ctx),
    )
    .row()
    .text(
      (ctx) => ctx.t('users-menu-button-add'),
      (ctx) => addUserInitialCallback(ctx),
    )
    .row()
    .text(
      (ctx) => ctx.t('users-menu-button-add-multiple'),
      (ctx) => addMultipleUsersCallback(ctx),
    )
    .row()
    .submenu(
      (ctx) => ctx.t('users-menu-button-change-role'),
      `${UsersMenu.CHANGE_ROLE}-${menuName}`,
    )
    .row()
    .submenu(
      (ctx) => ctx.t('users-menu-button-change-limits'),
      `${UsersMenu.CHANGE_GPT_LIMITS}-${menuName}`,
    )
    .row()
    .submenu(
      (ctx) => ctx.t('users-menu-button-block-unblock'),
      `${UsersMenu.BLOCK_UNBLOCK}-${menuName}`,
    )
    .row()
    .submenu((ctx) => ctx.t('users-menu-button-delete'), `${UsersMenu.DELETE}-${menuName}`)
    .row()
    .back((ctx) => ctx.t('common-button-go-back'));
};

export const changeUserRoleMenu = (menuName: string) =>
  new Menu<BotContextType>(`${UsersMenu.CHANGE_ROLE}-${menuName}`, {
    onMenuOutdated: false,
  })
    .dynamic(async (ctx) =>
      dynamicUsersMenuRange(ctx, async (_, username) => {
        ctx.menu.nav(`${UsersMenu.SELECT_NEW_ROLE}-${menuName}`);
        ctx.session.memory.data = username;
      }),
    )
    .text(
      (ctx) => ctx.t('common-button-cancel'),
      (ctx) => ctx.menu.nav(`${UsersMenu.INITIAL}-${menuName}`),
    );

export const selectNewUserRoleMenu = (menuName: string) =>
  new Menu<BotContextType>(`${UsersMenu.SELECT_NEW_ROLE}-${menuName}`, {
    onMenuOutdated: false,
  })
    .dynamic(async (ctx) => dynamicUserRolesMenuRange(ctx, changeUserRoleCallback))
    .text(
      (ctx) => ctx.t('common-button-cancel'),
      (ctx) => ctx.menu.nav(`${UsersMenu.CHANGE_ROLE}-${menuName}`),
    );

export const changeUserGptLimitsMenu = (menuName: string) =>
  new Menu<BotContextType>(`${UsersMenu.CHANGE_GPT_LIMITS}-${menuName}`, {
    onMenuOutdated: false,
  })
    .dynamic(async (ctx) =>
      dynamicUsersMenuRange(
        ctx,
        async (_, username) => {
          ctx.menu.nav(`${UsersMenu.SELECT_NEW_GPT_LIMITS}-${menuName}`);
          ctx.session.memory.data = username;
        },
        true,
      ),
    )
    .text(
      (ctx) => ctx.t('common-button-cancel'),
      (ctx) => ctx.menu.nav(`${UsersMenu.INITIAL}-${menuName}`),
    );

export const selectNewGptLimits = (menuName: string) =>
  new Menu<BotContextType>(`${UsersMenu.SELECT_NEW_GPT_LIMITS}-${menuName}`)
    .dynamic(async (ctx) => dynamicNewGptLimitsMenuRange(ctx, changeUserGptLimitsCallback))
    .text(
      (ctx) => ctx.t('common-button-cancel'),
      (ctx) => ctx.menu.nav(`${UsersMenu.CHANGE_GPT_LIMITS}-${menuName}`),
    );

export const blockUnblockUserMenu = (menuName: string) =>
  new Menu<BotContextType>(`${UsersMenu.BLOCK_UNBLOCK}-${menuName}`, {
    onMenuOutdated: false,
  })
    .dynamic(async (ctx) => dynamicUsersMenuRange(ctx, blockUnblockUserCallback))
    .text(
      (ctx) => ctx.t('common-button-cancel'),
      (ctx) => ctx.menu.nav(`${UsersMenu.INITIAL}-${menuName}`),
    );

export const deleteUserMenu = (menuName: string) =>
  new Menu<BotContextType>(`${UsersMenu.DELETE}-${menuName}`, { onMenuOutdated: false })
    .dynamic(async (ctx) => dynamicUsersMenuRange(ctx, deleteUserCallback))
    .text(
      (ctx) => ctx.t('common-button-cancel'),
      (ctx) => ctx.menu.nav(`${UsersMenu.INITIAL}-${menuName}`),
    );
