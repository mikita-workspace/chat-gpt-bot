import { mongo } from '@bot/services';
import { BotContextType, DynamicUsersMenuType, SessionModelType, UserModelType } from '@bot/types';
import { capitalize, isDocumentsTheSame } from '@bot/utils';
import { MenuRange } from '@grammyjs/menu';

export const dynamicUsersMenuRange: DynamicUsersMenuType = async (ctx, callback) => {
  const range = new MenuRange<BotContextType>();
  const currentUsername = String(ctx?.from?.username);

  let users: UserModelType[] = await mongo.getUsers();

  users
    .filter((user) => user.username !== currentUsername)
    .forEach((user) => {
      const username = user.username;
      const status = user.enabled ? 'Available' : 'Blocked';
      const role = user.role;

      range
        .text(`${username} - ${capitalize(role)} - ${status}`, async () => callback(username, ctx))
        .row();
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

export const dynamicUsersWithSessionMenuRange: DynamicUsersMenuType = async (
  ctx,
  callback,
  showCurrentUsername = true,
) => {
  const range = new MenuRange<BotContextType>();
  const currentUsername = String(ctx?.from?.username);

  const allUserSessions: SessionModelType[] = await mongo.getAllUserSessions();

  allUserSessions
    .filter((session) => showCurrentUsername || session.value.username !== currentUsername)
    .forEach((session) => {
      const username = session.value.username;

      range.text(username, async () => callback(username, ctx)).row();
    });

  return range;
};
