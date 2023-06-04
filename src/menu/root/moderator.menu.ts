import { CSV_READER_URL, ModeratorMenu, SessionsMenu, UsersMenu } from '@bot/constants';
import { BotContextType } from '@bot/types';
import { Menu } from '@grammyjs/menu';

export const moderatorMainMenu = new Menu<BotContextType>(ModeratorMenu.INITIAL)
  .submenu(
    (ctx) => ctx.t('moderator-menu-button-sessions'),
    `${SessionsMenu.INITIAL}-${ModeratorMenu.NAME}`,
  )
  .submenu(
    (ctx) => ctx.t('moderator-menu-button-users'),
    `${UsersMenu.INITIAL}-${ModeratorMenu.NAME}`,
  )
  .row()
  .url((ctx) => ctx.t('admin-menu-button-csv-reader'), CSV_READER_URL)
  .text(
    (ctx) => ctx.t('common-button-go-to-chat'),
    async (ctx) => {
      await ctx.deleteMessage();
      await ctx.reply(ctx.t('start-message'));
    },
  );
