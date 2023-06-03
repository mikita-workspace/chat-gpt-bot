import { UserRoles } from '@bot/constants';
import { mongo } from '@bot/services';
import {
  BotContextType,
  DynamicUserRolesMenuType,
  DynamicUsersMenuType,
  SessionModelType,
  UserModelType,
} from '@bot/types';
import { capitalize } from '@bot/utils';
import { MenuRange } from '@grammyjs/menu';

export const dynamicUserRolesMenuRange: DynamicUserRolesMenuType = async (ctx, callback) => {
  const range = new MenuRange<BotContextType>();
  const selectedUser = String(ctx?.match);

  Object.values(UserRoles)
    .filter((role) => role !== UserRoles.SUPER_ADMIN)
    .forEach((role) => {
      range
        .text({ text: ctx.t(`user-role-${role}`), payload: selectedUser }, async () =>
          callback(ctx, selectedUser, role),
        )
        .row();
    });

  return range;
};

export const dynamicUsersMenuRange: DynamicUsersMenuType = async (ctx, callback) => {
  const range = new MenuRange<BotContextType>();

  const currentUsername = String(ctx?.from?.username);
  const currentUserRole = (await mongo.getUser(String(ctx?.from?.username))).role;

  const users: UserModelType[] = await mongo.getUsers();

  users
    .filter((user) => user.username !== currentUsername)
    .filter(
      (user) =>
        currentUserRole !== UserRoles.MODERATOR ||
        ![UserRoles.MODERATOR, UserRoles.ADMIN, UserRoles.SUPER_ADMIN].includes(user.role),
    )
    .forEach((user) => {
      const username = user.username;
      const status = ctx.t(`user-status-${user.enabled ? 'available' : 'blocked'}`);
      const role = ctx.t(`user-role-${user.role}`);
      range
        .text(
          { text: `[ ${username} ] ${capitalize(role)}, ${status}`, payload: username },
          async () => callback(ctx, username),
        )
        .row();
    });

  return range;
};

export const dynamicUsersWithSessionMenuRange: DynamicUsersMenuType = async (
  ctx,
  callback,
  showCurrentUsername = true,
) => {
  const range = new MenuRange<BotContextType>();
  const currentUsername = String(ctx?.from?.username);

  const userSessions: SessionModelType[] = await mongo.getAllUserSessions();
  const users: UserModelType[] = await mongo.getUsers();
  const currentUserRole = (await mongo.getUser(currentUsername)).role;

  const sessions = userSessions.map((userSession) => ({
    value: {
      username: userSession.value.username,
      role:
        users.find((user) => user.username === userSession.value.username)?.role ?? UserRoles.USER,
    },
  }));

  sessions
    .filter((session) => showCurrentUsername || session.value.username !== currentUsername)
    .filter(
      (session) =>
        currentUserRole !== UserRoles.MODERATOR ||
        ![UserRoles.ADMIN, UserRoles.SUPER_ADMIN].includes(session.value.role),
    )
    .forEach((session) => {
      const username = session.value.username;

      range.text(username, async () => callback(ctx, username)).row();
    });

  return range;
};
