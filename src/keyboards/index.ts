import { AdminMenuActions, UserRoles, UsersMenuActions } from '@bot/constants';
import { BotContextType, UserModelType } from '@bot/types';
import { capitalize } from '@bot/utils';
import { InlineKeyboard } from 'grammy';

export const adminInlineGoToMainMenu = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('admin-go-to-main'), AdminMenuActions.GO_TO_MENU);

export const adminInlineAddNewUser = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('error-common-try-again'), UsersMenuActions.ADD_NEW_USER);

// TODO: re-write
export const adminInlineSelectRole = new InlineKeyboard().add(
  ...Object.values(UserRoles)
    .filter((role) => role !== UserRoles.SUPER_ADMIN)
    .map((role) => ({
      text: capitalize(role),
      callback_data: `admin-select-role-action-${role}`,
    })),
);

// TODO: re-write
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
  inlineKeyboard.text(ctx.t('admin-go-to-main'), AdminMenuActions.GO_TO_MENU);

  return inlineKeyboard;
};
