import { BotContextType } from '@bot/types';

export type DynamicUsersMenuType = (
  ctx: BotContextType,
  callback: (username: string, ctx: BotContextType) => void,
  showCurrentUsername?: boolean,
) => void;
