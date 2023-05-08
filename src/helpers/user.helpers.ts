import { UserModelType } from '@bot/types';
import { UsersCsvIds } from '@bot/constants';

export const mapUsers = (users: UserModelType[]) =>
  users.map(({ username, role, enabled, timestamp }) => ({
    [UsersCsvIds.USERNAME]: username,
    [UsersCsvIds.ROLE]: role,
    [UsersCsvIds.ENABLED]: enabled,
    [UsersCsvIds.TIMESTAMP]: timestamp,
  }));
