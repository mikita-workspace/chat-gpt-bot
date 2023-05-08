import { UserModelType } from '../types';
import { UsersCsvIds } from '../constants';

export const mapUsers = (users: UserModelType[]) =>
  users.map(({ username, role, enabled, timestamp }) => ({
    [UsersCsvIds.USERNAME]: username,
    [UsersCsvIds.ROLE]: role,
    [UsersCsvIds.ENABLED]: enabled,
    [UsersCsvIds.TIMESTAMP]: timestamp,
  }));
