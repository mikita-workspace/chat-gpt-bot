import {
  addUserInitialCallback,
  blockUnblockUserCallback,
  deleteUserCallback,
  deleteUserConversationMessagesCallback,
  deleteUserSessionMessagesCallback,
  downloadLogsCallback,
  getAllUsersCallback,
  getUserConversationMessagesCallback,
  getUserSessionMessagesCallback,
} from '@bot/callbacks';
import { CSV_READER_URL } from '@bot/constants';
import { mongo } from '@bot/services';
import { BotContextType, SessionModelType, UserModelType } from '@bot/types';
import { isDocumentsTheSame } from '@bot/utils';
import { Menu, MenuRange } from '@grammyjs/menu';

export const dynamicUsersMenuRange = async (
  ctx: BotContextType,
  callback: (username: string, ctx: BotContextType) => void,
) => {
  const range = new MenuRange<BotContextType>();
  const currentUsername = ctx?.from?.username ?? '';

  let users: UserModelType[] = await mongo.getUsers();

  users
    .filter((user) => user.username !== currentUsername)
    .forEach((user) => {
      const username = user.username;
      const status = user.enabled ? 'Available' : 'Blocked';

      range.text(`${username} - ${status}`, async () => callback(username, ctx)).row();
    });

  range.text(
    () => ctx.t('admin-block-unblock-user-refresh'),
    async () => {
      const newUsers = await mongo.getUsers(true);

      if (!isDocumentsTheSame(users, newUsers)) {
        users = newUsers;
        ctx.menu.update();
      }
    },
  );

  return range;
};

export const dynamicUsersWithSessionMenuRange = async (
  ctx: BotContextType,
  callback: (username: string, ctx: BotContextType) => void,
  showCurrentUsername = true,
) => {
  const range = new MenuRange<BotContextType>();
  const currentUsername = ctx?.from?.username ?? '';

  const allUserSessions: SessionModelType[] = await mongo.getAllUserSessions();

  allUserSessions
    .filter((session) => showCurrentUsername || session.value.username !== currentUsername)
    .forEach((session) => {
      const username = session.value.username;

      range.text(username, async () => callback(username, ctx)).row();
    });

  return range;
};

export const adminMenu = new Menu<BotContextType>('admin-main-menu')
  .submenu((ctx) => ctx.t('admin-sessions'), 'admin-sessions-menu')
  .submenu((ctx) => ctx.t('admin-conversations'), 'admin-conversations-menu')
  .row()
  .submenu((ctx) => ctx.t('admin-users'), 'admin-users-menu')
  .text(
    (ctx) => ctx.t('admin-logs'),
    (ctx) => downloadLogsCallback(ctx),
  )
  .row()
  .url((ctx) => ctx.t('admin-csv-reader'), CSV_READER_URL)
  .text(
    (ctx) => ctx.t('admin-go-to-bot'),
    async (ctx) => {
      await ctx.deleteMessage();
      await ctx.reply(ctx.t('bot-initial'));
    },
  );

export const adminSubMenu = [
  new Menu<BotContextType>('admin-sessions-menu')
    .submenu((ctx) => ctx.t('admin-get-session'), 'admin-dynamic-users-for-sessions-menu')
    .submenu((ctx) => ctx.t('admin-delete-session'), 'admin-dynamic-users-for-delete-sessions-menu')
    .row()
    .back((ctx) => ctx.t('admin-go-back')),
  new Menu<BotContextType>('admin-users-menu')
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
    .submenu((ctx) => ctx.t('admin-block-unblock-user'), 'admin-dynamic-users-menu')
    .row()
    .submenu((ctx) => ctx.t('admin-delete-user'), 'admin-dynamic-delete-users')
    .row()
    .back((ctx) => ctx.t('admin-go-back')),
  new Menu<BotContextType>('admin-conversations-menu')
    .submenu(
      (ctx) => ctx.t('admin-get-conversations'),
      'admin-dynamic-users-for-conversations-menu',
    )
    .submenu(
      (ctx) => ctx.t('admin-delete-conversations'),
      'admin-dynamic-users-for-delete-conversations-menu',
    )
    .row()
    .back((ctx) => ctx.t('admin-go-back')),
  new Menu<BotContextType>('admin-dynamic-users-menu', {
    onMenuOutdated: false,
  })
    .dynamic(async (ctx) => dynamicUsersMenuRange(ctx, blockUnblockUserCallback))
    .back((ctx) => ctx.t('admin-cancel')),
  new Menu<BotContextType>('admin-dynamic-users-for-sessions-menu')
    .dynamic(async (ctx) => dynamicUsersWithSessionMenuRange(ctx, getUserSessionMessagesCallback))
    .back((ctx) => ctx.t('admin-cancel')),
  new Menu<BotContextType>('admin-dynamic-users-for-delete-sessions-menu')
    .dynamic(async (ctx) =>
      dynamicUsersWithSessionMenuRange(ctx, deleteUserSessionMessagesCallback, false),
    )
    .back((ctx) => ctx.t('admin-cancel')),
  new Menu<BotContextType>('admin-dynamic-users-for-conversations-menu')
    .dynamic(async (ctx) =>
      dynamicUsersWithSessionMenuRange(ctx, getUserConversationMessagesCallback),
    )
    .back((ctx) => ctx.t('admin-cancel')),
  new Menu<BotContextType>('admin-dynamic-users-for-delete-conversations-menu')
    .dynamic(async (ctx) =>
      dynamicUsersWithSessionMenuRange(ctx, deleteUserConversationMessagesCallback, false),
    )
    .back((ctx) => ctx.t('admin-cancel')),
  new Menu<BotContextType>('admin-dynamic-delete-users')
    .dynamic(async (ctx) => dynamicUsersMenuRange(ctx, deleteUserCallback))
    .back((ctx) => ctx.t('admin-cancel')),
];
