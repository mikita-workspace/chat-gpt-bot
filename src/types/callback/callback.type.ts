import { UserRoles } from '@bot/constants';
import { BotContextType } from '@bot/types';

export type DynamicUserRolesMenuCallbackType = (
  ctx: BotContextType,
  username: string,
  role: UserRoles,
) => void;

export type DynamicNewGptLimitsMenuCallbackType = (
  ctx: BotContextType,
  username: string,
  newPackage: string,
  newLimit: string,
) => void;

export type DynamicUsersMenuCallbackType = (ctx: BotContextType, username: string) => Promise<void>;
