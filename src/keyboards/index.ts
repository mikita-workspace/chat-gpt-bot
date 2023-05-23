import { AdminMenuActions, UsersMenuActions } from '@bot/constants';
import { BotContextType } from '@bot/types';
import { InlineKeyboard } from 'grammy';

export const adminInlineGoToMainMenu = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('admin-go-to-main'), AdminMenuActions.GO_TO_MENU);

export const adminInlineAddNewUser = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('error-common-try-again'), UsersMenuActions.ADD_NEW_USER);
