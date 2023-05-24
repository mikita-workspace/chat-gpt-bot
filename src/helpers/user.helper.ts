import { config } from '@bot/config';
import { UserRoles, UsersCsvIds } from '@bot/constants';
import { UserModelType } from '@bot/types';

export const mapUsers = (users: UserModelType[]) =>
  users.map(({ username, role, enabled, timestamp }) => ({
    [UsersCsvIds.USERNAME]: username,
    [UsersCsvIds.ROLE]: role,
    [UsersCsvIds.ENABLED]: enabled,
    [UsersCsvIds.TIMESTAMP]: timestamp,
  }));

export const mapUsersFromCsv = (users: UserModelType[]) =>
  users.map(({ username, role }) => ({
    username,
    role: (() => {
      if (username === config.SUPER_ADMIN_USERNAME) {
        return UserRoles.SUPER_ADMIN;
      }

      return Object.values(UserRoles).includes(role as UserRoles) ? role : UserRoles.USER;
    })(),
  }));
