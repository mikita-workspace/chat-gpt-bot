import {
  addMultipleUsersCallback,
  addUserInitialCallback,
  blockUnblockUserCallback,
  changeUserRoleCallback,
  deleteUserCallback,
  getAllUsersCallback,
} from '@bot/callbacks';
import { UsersMenu } from '@bot/constants';
import { dynamicUserRolesMenuRange, dynamicUsersMenuRange } from '@bot/helpers';
import { BotContextType } from '@bot/types';
import { Menu } from '@grammyjs/menu';

export const usersMenu = new Menu<BotContextType>(UsersMenu.INITIAL)
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
  .submenu((ctx) => ctx.t('users-menu-button-change-role'), UsersMenu.CHANGE_ROLE)
  .row()
  .submenu((ctx) => ctx.t('users-menu-button-block-unblock'), UsersMenu.BLOCK_UNBLOCK)
  .row()
  .submenu((ctx) => ctx.t('users-menu-button-delete'), UsersMenu.DELETE)
  .row()
  .back((ctx) => ctx.t('common-button-go-back'));

export const changeUserRoleMenu = new Menu<BotContextType>(UsersMenu.CHANGE_ROLE, {
  onMenuOutdated: false,
})
  .dynamic(async (ctx) =>
    dynamicUsersMenuRange(ctx, async () => ctx.menu.nav(UsersMenu.SELECT_NEW_ROLE)),
  )
  .text(
    (ctx) => ctx.t('common-button-cancel'),
    (ctx) => ctx.menu.nav(UsersMenu.INITIAL),
  );

export const selectNewUserRoleMenu = new Menu<BotContextType>(UsersMenu.SELECT_NEW_ROLE, {
  onMenuOutdated: false,
})
  .dynamic(async (ctx) => dynamicUserRolesMenuRange(ctx, changeUserRoleCallback))
  .text(
    (ctx) => ctx.t('common-button-cancel'),
    (ctx) => ctx.menu.nav(UsersMenu.CHANGE_ROLE),
  );

export const blockUnblockUserMenu = new Menu<BotContextType>(UsersMenu.BLOCK_UNBLOCK, {
  onMenuOutdated: false,
})
  .dynamic(async (ctx) => dynamicUsersMenuRange(ctx, blockUnblockUserCallback))
  .text(
    (ctx) => ctx.t('common-button-cancel'),
    (ctx) => ctx.menu.nav(UsersMenu.INITIAL),
  );

export const deleteUserMenu = new Menu<BotContextType>(UsersMenu.DELETE, { onMenuOutdated: false })
  .dynamic(async (ctx) => dynamicUsersMenuRange(ctx, deleteUserCallback))
  .text(
    (ctx) => ctx.t('common-button-cancel'),
    (ctx) => ctx.menu.nav(UsersMenu.INITIAL),
  );
