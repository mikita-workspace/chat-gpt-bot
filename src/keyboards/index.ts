import { AdminMenuActions, UsersMenuActions } from '@bot/constants';
import { BotContextType } from '@bot/types';
import { InlineKeyboard } from 'grammy';

export const adminInlineGoToMainMenu = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('admin-menu-button-go-to-menu'), AdminMenuActions.GO_TO_MENU);

export const adminInlineAddNewUser = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('error-message-common-try-again'), UsersMenuActions.ADD_NEW_USER);
