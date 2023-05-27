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
    role: Object.values(UserRoles).includes(role) ? role : UserRoles.USER,
  }));
