import { UserRoles } from '@bot/constants';
import { BotContextType } from '@bot/types';

export type DynamicUserRolesMenuType = (
  ctx: BotContextType,
  callback: (username: string, role: `${UserRoles}`, ctx: BotContextType) => void,
) => void;

export type DynamicUsersMenuType = (
  ctx: BotContextType,
  callback: (username: string, ctx: BotContextType) => void,
  showCurrentUsername?: boolean,
) => void;
