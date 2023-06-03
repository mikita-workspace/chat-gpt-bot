import {
  BotContextType,
  DynamicNewGptLimitsMenuCallbackType,
  DynamicUserRolesMenuCallbackType,
  DynamicUsersMenuCallbackType,
} from '@bot/types';

export type DynamicUserRolesMenuType = (
  ctx: BotContextType,
  callback: DynamicUserRolesMenuCallbackType,
) => void;

export type DynamicNewGptLimitsMenuType = (
  ctx: BotContextType,
  callback: DynamicNewGptLimitsMenuCallbackType,
) => void;

export type DynamicUsersMenuType = (
  ctx: BotContextType,
  callback: DynamicUsersMenuCallbackType,
  showCurrentUsername?: boolean,
) => void;
