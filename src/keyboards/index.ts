import {
  AdminMenuActions,
  CommonActions,
  ModeratorMenuActions,
  UserImagesMenuActions,
  UsersMenuActions,
} from '@bot/constants';
import { BotContextType } from '@bot/types';
import { InlineKeyboard } from 'grammy';

export const inlineGoToChat = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('common-button-go-to-chat'), CommonActions.GO_TO_CHAT);

export const inlineGoToAdminMenu = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('admin-menu-button-go-to-menu'), AdminMenuActions.GO_TO_MENU);

export const inlineGoToModeratorMenu = (ctx: BotContextType) =>
  new InlineKeyboard().text(
    ctx.t('moderator-menu-button-go-to-menu'),
    ModeratorMenuActions.GO_TO_MENU,
  );

export const inlineAddNewUser = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('error-message-common-try-again'), UsersMenuActions.ADD_NEW_USER);

export const inlineAddNewMultipleUsers = (ctx: BotContextType) =>
  new InlineKeyboard().text(
    ctx.t('error-message-common-try-again'),
    UsersMenuActions.ADD_NEW_MULTIPLE_USERS,
  );

export const inlineShareWithContacts = (ctx: BotContextType, query: string) =>
  new InlineKeyboard().switchInline(ctx.t('common-button-share'), query);

export const inlineCreateImage = (ctx: BotContextType) =>
  new InlineKeyboard().text(
    ctx.t('error-message-common-try-again'),
    UserImagesMenuActions.CREATE_IMAGE,
  );
