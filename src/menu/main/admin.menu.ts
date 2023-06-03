import { downloadBotLoggerCallback } from '@bot/callbacks';
import {
  AdminMenu,
  ConversationsMenu,
  CSV_READER_URL,
  SessionsMenu,
  UsersMenu,
} from '@bot/constants';
import { BotContextType } from '@bot/types';
import { Menu } from '@grammyjs/menu';

export const adminMainMenu = new Menu<BotContextType>(AdminMenu.INITIAL)
  .submenu(
    (ctx) => ctx.t('admin-menu-button-sessions'),
    `${SessionsMenu.INITIAL}-${AdminMenu.NAME}`,
  )
  .submenu(
    (ctx) => ctx.t('admin-menu-button-conversations'),
    `${ConversationsMenu.INITIAL}-${AdminMenu.NAME}`,
  )
  .row()
  .submenu((ctx) => ctx.t('admin-menu-button-users'), `${UsersMenu.INITIAL}-${AdminMenu.NAME}`)
  .text(
    (ctx) => ctx.t('admin-menu-button-loggers'),
    (ctx) => downloadBotLoggerCallback(ctx),
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
