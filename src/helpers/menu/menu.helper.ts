import { GPTLimits, UserRoles } from '@bot/constants';
import { mongo } from '@bot/services';
import {
  BotContextType,
  DynamicNewGptLimitsMenuType,
  DynamicUserRolesMenuType,
  DynamicUsersMenuType,
} from '@bot/types';
import { capitalize } from '@bot/utils';
import { MenuRange } from '@grammyjs/menu';

export const dynamicUserRolesMenuRange: DynamicUserRolesMenuType = async (ctx, callback) => {
  const range = new MenuRange<BotContextType>();
  const selectedUser = String(ctx.session.memory.userData.selectedUsername);

  Object.values(UserRoles)
    .filter((role) => role !== UserRoles.SUPER_ADMIN)
    .forEach((role) => {
      range.text(ctx.t(`user-role-${role}`), async () => callback(ctx, selectedUser, role)).row();
    });

  return range;
};

export const dynamicNewGptLimitsMenuRange: DynamicNewGptLimitsMenuType = async (ctx, callback) => {
  const range = new MenuRange<BotContextType>();
  const selectedUser = String(ctx.session.memory.userData.selectedUsername);

  Object.entries(GPTLimits).forEach(([newPackage, newLimit]) => {
    range
      .text(`[ ${ctx.t(`user-gpt-limit-${newPackage.toLowerCase()}`)} ] ${newLimit}`, async () =>
        callback(ctx, selectedUser, newPackage, newLimit),
      )
      .row();
  });

  return range;
};

export const dynamicUsersMenuRange: DynamicUsersMenuType = async (
  ctx,
  callback,
  showCurrentUsername = false,
) => {
  const range = new MenuRange<BotContextType>();

  const currentUsername = String(ctx?.from?.username);
  const currentUserRole = (await mongo.getUser(String(ctx?.from?.username)))?.role;

  const users = await mongo.getUsers();

  users
    .filter(
      (user) =>
        (showCurrentUsername && currentUserRole === UserRoles.SUPER_ADMIN) ||
        user.username !== currentUsername,
    )
    .filter(
      (user) =>
        currentUserRole !== UserRoles.MODERATOR ||
        ![UserRoles.MODERATOR, UserRoles.ADMIN, UserRoles.SUPER_ADMIN].includes(user.role),
    )
    .forEach((user) => {
      const username = user.username;
      const limits = user.limit;
      const status = ctx.t(`user-status-${user.enabled ? 'available' : 'blocked'}`);
      const role = ctx.t(`user-role-${user.role}`);

      range
        .text(
          `[ ${username} ] ${capitalize(role)}, ${status}, ${limits.gptTokens} / ${
            limits.gptImages
          }`,
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

  const userSessions = await mongo.getAllUserSessions();
  const users = await mongo.getUsers();
  const currentUserRole = (await mongo.getUser(currentUsername))?.role;

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

export const dynamicUserImagesMenuRange: DynamicUsersMenuType = async (ctx, callback) => {
  const range = new MenuRange<BotContextType>();

  const userImages = await mongo.getAllUserImages();

  userImages
    .map(({ username }) => username)
    .forEach((username) => range.text(username, async () => callback(ctx, username)).row());

  return range;
};
