import { getUserImagesArchiveCallback, getUserImagesCsvCallback } from '@bot/callbacks';
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
    .dynamic(async (ctx) =>
      dynamicUserImagesMenuRange(ctx, async (_, username) => {
        ctx.menu.nav(`${UserImagesMenu.GET_ARCHIVE_OR_CSV}-${menuName}`);
        ctx.session.memory.userData.selectedUsername = username;
      }),
    )
    .text(
      (ctx) => ctx.t('common-button-cancel'),
      (ctx) => ctx.menu.nav(`${UserImagesMenu.INITIAL}-${menuName}`),
    );

export const getArchiveOrCsvMenu = (menuName: string) =>
  new Menu<BotContextType>(`${UserImagesMenu.GET_ARCHIVE_OR_CSV}-${menuName}`)
    .text(
      (ctx) => ctx.t('user-images-menu-button-get-csv'),
      (ctx) => getUserImagesCsvCallback(ctx, String(ctx.session.memory.userData.selectedUsername)),
    )
    .row()
    .text(
      (ctx) => ctx.t('user-images-menu-button-get-archive'),
      (ctx) =>
        getUserImagesArchiveCallback(ctx, String(ctx.session.memory.userData.selectedUsername)),
    )
    .row()
    .text(
      (ctx) => ctx.t('common-button-cancel'),
      (ctx) => ctx.menu.nav(`${UserImagesMenu.GET}-${menuName}`),
    );
