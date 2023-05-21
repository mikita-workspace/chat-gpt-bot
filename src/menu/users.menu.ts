import {
  addUserInitialCallback,
  blockUnblockUserCallback,
  // changeUserRoleCallback,
  deleteUserCallback,
  getAllUsersCallback,
} from '@bot/callbacks';
import { UsersMenu } from '@bot/constants';
import { dynamicUsersMenuRange } from '@bot/helpers';
import { BotContextType } from '@bot/types';
import { Menu } from '@grammyjs/menu';

export const usersMenu = new Menu<BotContextType>(UsersMenu.INITIAL)
  .text(
    (ctx) => ctx.t('admin-get-all-users'),
    (ctx) => getAllUsersCallback(ctx),
  )
  .row()
  .text(
    (ctx) => ctx.t('admin-add-user'),
    (ctx) => addUserInitialCallback(ctx),
  )
  .row()
  .submenu((ctx) => ctx.t('admin-change-role-user'), UsersMenu.CHANGE_ROLE)
  .row()
  .submenu((ctx) => ctx.t('admin-block-unblock-user'), UsersMenu.BLOCK_UNBLOCK)
  .row()
  .submenu((ctx) => ctx.t('admin-delete-user'), UsersMenu.DELETE)
  .row()
  .back((ctx) => ctx.t('admin-go-back'));

export const changeUserRoleMenu = new Menu<BotContextType>(UsersMenu.CHANGE_ROLE, {
  onMenuOutdated: false,
})
  .dynamic(async (ctx) => dynamicUsersMenuRange(ctx, () => {}))
  .text(
    (ctx) => ctx.t('admin-cancel'),
    (ctx) => ctx.menu.nav(UsersMenu.INITIAL),
  );

// TODO: finish this function
export const selectNewUserRoleMenu = new Menu<BotContextType>(UsersMenu.SELECT_NEW_ROLE, {
  onMenuOutdated: false,
})
  // .dynamic(async (ctx) => {})
  .text(
    (ctx) => ctx.t('admin-cancel'),
    (ctx) => ctx.menu.nav(UsersMenu.INITIAL),
  );

export const blockUnblockUserMenu = new Menu<BotContextType>(UsersMenu.BLOCK_UNBLOCK, {
  onMenuOutdated: false,
})
  .dynamic(async (ctx) => dynamicUsersMenuRange(ctx, blockUnblockUserCallback))
  .text(
    (ctx) => ctx.t('admin-cancel'),
    (ctx) => ctx.menu.nav(UsersMenu.INITIAL),
  );

export const deleteUserMenu = new Menu<BotContextType>(UsersMenu.DELETE, { onMenuOutdated: false })
  .dynamic(async (ctx) => dynamicUsersMenuRange(ctx, deleteUserCallback))
  .text(
    (ctx) => ctx.t('admin-cancel'),
    (ctx) => ctx.menu.nav(UsersMenu.INITIAL),
  );
