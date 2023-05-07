import { Menu, MenuRange } from '@grammyjs/menu';
import { mongo } from '../../services';
import {
  addUserInitialCallback,
  blockUnblockUserCallback,
  getAllUsersCallback,
} from '../../callbacks';
import { BotContextType, UserModelType } from '../../types';

export const adminMainMenu = new Menu<BotContextType>('admin-main-menu')
  .submenu((ctx) => ctx.t('admin-sessions'), 'admin-sessions-menu')
  .submenu((ctx) => ctx.t('admin-users'), 'admin-users-menu');

export const adminSessionsMenu = new Menu<BotContextType>('admin-sessions-menu')
  .text((ctx) => ctx.t('admin-get-session'))
  .text((ctx) => ctx.t('admin-delete-session'))
  .row()
  .back((ctx) => ctx.t('admin-go-back'));

export const adminUsersMenu = new Menu<BotContextType>('admin-users-menu')
  .text((ctx) => ctx.t('admin-get-all-users'), getAllUsersCallback)
  .row()
  .text((ctx) => ctx.t('admin-add-user'), addUserInitialCallback)
  .row()
  .submenu((ctx) => ctx.t('admin-block-unblock-user'), 'admin-dynamic-users-menu')
  .row()
  .back((ctx) => ctx.t('admin-go-back'));

export const adminDynamicUsersMenu = new Menu<BotContextType>('admin-dynamic-users-menu')
  .dynamic(async (ctx) => {
    const range = new MenuRange<BotContextType>();
    const currentUsername = ctx?.update?.callback_query?.from?.username ?? '';

    const users: UserModelType[] = (await mongo.getUsers()) ?? [];

    users
      .filter((user) => user.username !== currentUsername)
      .forEach((user) => {
        const username = user.username;

        range.text(username, async () => blockUnblockUserCallback(username, ctx)).row();
      });

    return range;
  })
  .back((ctx) => ctx.t('admin-cancel'));
