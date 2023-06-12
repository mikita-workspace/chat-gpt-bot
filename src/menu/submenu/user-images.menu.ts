import { getUserImagesCallback } from '@bot/callbacks';
import { UserImagesMenu } from '@bot/constants';
import { dynamicUserImagesMenuRange } from '@bot/helpers';
import { BotContextType } from '@bot/types';
import { Menu } from '@grammyjs/menu';

export const userImagesMenu = (menuName: string) =>
  new Menu<BotContextType>(`${UserImagesMenu.INITIAL}-${menuName}`)
    .submenu((ctx) => ctx.t('user-images-menu-button-get'), `${UserImagesMenu.GET}-${menuName}`)
    .row()
    .back((ctx) => ctx.t('common-button-go-back'));

export const getUserImagesMenu = (menuName: string) =>
  new Menu<BotContextType>(`${UserImagesMenu.GET}-${menuName}`, {
    onMenuOutdated: false,
  })
    .dynamic(async (ctx) => dynamicUserImagesMenuRange(ctx, getUserImagesCallback))
    .text(
      (ctx) => ctx.t('common-button-cancel'),
      (ctx) => ctx.menu.nav(`${UserImagesMenu.INITIAL}-${menuName}`),
    );
