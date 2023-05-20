import { UserRoles } from '@bot/constants';
import { BotContextType, UserModelType } from '@bot/types';
import { capitalize } from '@bot/utils';
import { InlineKeyboard } from 'grammy';

export const adminInlineGoToMainMenu = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('admin-go-to-main'), 'admin-go-to-main-action');

export const adminInlineAddNewUser = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('error-common-try-again'), 'admin-add-new-user-action');

export const adminInlineSelectRole = new InlineKeyboard().add(
  ...Object.values(UserRoles)
    .filter((role) => role !== UserRoles.SUPER_ADMIN)
    .map((role) => ({
      text: capitalize(role),
      callback_data: `admin-select-role-action-${role}`,
    })),
);

export const adminInlineListUsers = (ctx: BotContextType, users: UserModelType[]) => {
  const inlineKeyboard = new InlineKeyboard();

  users.forEach(({ username, enabled, role }) =>
    inlineKeyboard
      .add({
        text: `[${username}]: ${capitalize(role)}, ${enabled ? 'Available' : 'Blocked'}`,
        callback_data: `admin-list-users-action-${username}`,
      })
      .row(),
  );
  inlineKeyboard.text(ctx.t('admin-go-to-main'), 'admin-go-to-main-action');

  return inlineKeyboard;
};
