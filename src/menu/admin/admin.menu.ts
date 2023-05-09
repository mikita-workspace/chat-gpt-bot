import {
  addUserInitialCallback,
  blockUnblockUserCallback,
  deleteUserSessionMessagesCallback,
  downloadLogsCallback,
  getAllUsersCallback,
  getUserSessionMessagesCallback,
} from '@bot/callbacks';
import { CSV_READER_URL } from '@bot/constants';
import { mongo } from '@bot/services';
import { BotContextType, SessionModelType, UserModelType } from '@bot/types';
import { Menu, MenuRange } from '@grammyjs/menu';
import { InlineKeyboard } from 'grammy';

export const dynamicUsersMenuRange = async (
  ctx: BotContextType,
  callback: (username: string, ctx: BotContextType) => void,
) => {
  const range = new MenuRange<BotContextType>();
  const currentUsername = ctx?.update?.callback_query?.from?.username ?? '';

  const users: UserModelType[] = await mongo.getUsers();

  users
    .filter((user) => user.username !== currentUsername)
    .forEach((user) => {
      const username = user.username;

      range.text(username, async () => callback(username, ctx)).row();
    });

  return range;
};

export const dynamicUsersWithSessionMenuRange = async (
  ctx: BotContextType,
  callback: (username: string, ctx: BotContextType) => void,
  showCurrentUsername = true,
) => {
  const range = new MenuRange<BotContextType>();
  const currentUsername = ctx?.update?.callback_query?.from?.username ?? '';

  const allUserSessions: SessionModelType[] = await mongo.getAllUserSessions();

  allUserSessions
    .filter((session) => showCurrentUsername || session.value.username !== currentUsername)
    .forEach((session) => {
      const username = session.value.username;

      range.text(username, async () => callback(username, ctx)).row();
    });

  return range;
};

export const adminMainMenu = new Menu<BotContextType>('admin-main-menu')
  .submenu((ctx) => ctx.t('admin-sessions'), 'admin-sessions-menu')
  .submenu((ctx) => ctx.t('admin-users'), 'admin-users-menu')
  .row()
  .submenu((ctx) => ctx.t('admin-logs'), 'admin-logs-menu')
  .url((ctx) => ctx.t('admin-csv-reader'), CSV_READER_URL)
  .row()
  .text(
    (ctx) => ctx.t('admin-go-to-bot'),
    async (ctx) => {
      await ctx.deleteMessage();
      await ctx.reply(ctx.t('bot-initial'));
    },
  );

export const adminSessionsMenu = new Menu<BotContextType>('admin-sessions-menu')
  .submenu((ctx) => ctx.t('admin-get-session'), 'admin-dynamic-users-for-sessions-menu')
  .submenu((ctx) => ctx.t('admin-delete-session'), 'admin-dynamic-users-for-delete-sessions-menu')
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

export const adminLogsMenu = new Menu<BotContextType>('admin-logs-menu')
  .text(
    (ctx) => ctx.t('admin-logs-download', { filename: 'errors.log' }),
    (ctx) => downloadLogsCallback('errors', ctx),
  )
  .row()
  .text(
    (ctx) => ctx.t('admin-logs-download', { filename: 'combined.log' }),
    (ctx) => downloadLogsCallback('combined', ctx),
  )
  .row()
  .back((ctx) => ctx.t('admin-go-back'));

export const adminDynamicUsersMenu = new Menu<BotContextType>('admin-dynamic-users-menu')
  .dynamic(async (ctx) => dynamicUsersMenuRange(ctx, blockUnblockUserCallback))
  .back((ctx) => ctx.t('admin-cancel'));

export const adminDynamicUsersForSessionsMenu = new Menu<BotContextType>(
  'admin-dynamic-users-for-sessions-menu',
)
  .dynamic(async (ctx) => dynamicUsersWithSessionMenuRange(ctx, getUserSessionMessagesCallback))
  .back((ctx) => ctx.t('admin-cancel'));

export const adminDynamicUsersForDeleteSessionsMenu = new Menu<BotContextType>(
  'admin-dynamic-users-for-delete-sessions-menu',
)
  .dynamic(async (ctx) =>
    dynamicUsersWithSessionMenuRange(ctx, deleteUserSessionMessagesCallback, false),
  )
  .back((ctx) => ctx.t('admin-cancel'));

export const adminInlineGoToMainMenu = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('admin-go-to-main'), 'admin-go-to-main-action');
