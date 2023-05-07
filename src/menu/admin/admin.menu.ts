import { Menu } from '@grammyjs/menu';
import { addUserInitialCallback } from '../../callbacks';
import { BotContextType } from '../../types';

export const adminMainMenu = new Menu<BotContextType>('admin-main-menu')
  .submenu((ctx) => ctx.t('admin-sessions'), 'admin-sessions-menu')
  .submenu((ctx) => ctx.t('admin-users'), 'admin-users-menu');

export const adminSessionsMenu = new Menu<BotContextType>('admin-sessions-menu')
  .text((ctx) => ctx.t('admin-get-session'))
  .text((ctx) => ctx.t('admin-delete-session'))
  .row()
  .back((ctx) => ctx.t('admin-go-back'));

export const adminUsersMenu = new Menu<BotContextType>('admin-users-menu')
  .text((ctx) => ctx.t('admin-get-all-users'))
  .text((ctx) => ctx.t('admin-add-user'), addUserInitialCallback)
  .row()
  .text((ctx) => ctx.t('admin-block-user'))
  .text((ctx) => ctx.t('admin-unblock-user'))
  .row()
  .back((ctx) => ctx.t('admin-go-back'));
