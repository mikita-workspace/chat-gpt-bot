import { UserRoles } from '@bot/constants';
import { BotContextType } from '@bot/types';

export type DynamicUserRolesMenuType = (
  ctx: BotContextType,
  callback: (ctx: BotContextType, username: string, role: `${UserRoles}`) => void,
) => void;

export type DynamicUsersMenuType = (
  ctx: BotContextType,
  callback: (ctx: BotContextType, username: string) => void,
  showCurrentUsername?: boolean,
) => void;
