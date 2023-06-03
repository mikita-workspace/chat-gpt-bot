import {
  BotContextType,
  DynamicUserRolesMenuCallbackType,
  DynamicUsersMenuCallbackType,
} from '@bot/types';

export type DynamicUserRolesMenuType = (
  ctx: BotContextType,
  callback: DynamicUserRolesMenuCallbackType,
) => void;

export type DynamicUsersMenuType = (
  ctx: BotContextType,
  callback: DynamicUsersMenuCallbackType,
  showCurrentUsername?: boolean,
) => void;
