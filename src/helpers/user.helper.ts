import { UserRoles, UsersCsvIds } from '@bot/constants';
import { UserModelType } from '@bot/types';

export const mapUsers = (users: UserModelType[]) =>
  users.map(({ username, role, enabled, timestamp, limit: { gptTokens, gptImages, expire } }) => ({
    [UsersCsvIds.USERNAME]: username,
    [UsersCsvIds.ROLE]: role,
    [UsersCsvIds.ENABLED]: enabled,
    [UsersCsvIds.TIMESTAMP]: timestamp,
    [UsersCsvIds.GPT_TOKENS]: gptTokens,
    [UsersCsvIds.GPT_IMAGES]: gptImages,
    [UsersCsvIds.EXPIRE]: expire,
  }));

export const mapUsersFromCsv = (users: UserModelType[]) =>
  users.map(({ username, role }) => ({
    username,
    role: Object.values(UserRoles).includes(role) ? role : UserRoles.USER,
  }));
