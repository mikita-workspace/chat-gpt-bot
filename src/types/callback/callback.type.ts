import { UserRoles } from '@bot/constants';
import { BotContextType } from '@bot/types';

export type DynamicUserRolesMenuCallbackType = (
  ctx: BotContextType,
  username: string,
  role: UserRoles,
) => void;

export type DynamicUsersMenuCallbackType = (ctx: BotContextType, username: string) => Promise<void>;
