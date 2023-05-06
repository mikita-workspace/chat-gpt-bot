import { InlineKeyboard } from 'grammy';
import { BotContextType } from '../types';
import { CallbackQueryActions } from '../constants';

export const getMainInlineKeyboard = (ctx: BotContextType) =>
  new InlineKeyboard()
    .text(ctx.t('admin-sessions'), CallbackQueryActions.SESSIONS)
    .text(ctx.t('admin-users'), CallbackQueryActions.USERS);

export const getSessionsInlineKeyboard = (ctx: BotContextType) =>
  new InlineKeyboard()
    .text(ctx.t('admin-get-session'), CallbackQueryActions.GET_SESSION)
    .text(ctx.t('admin-delete-session'), CallbackQueryActions.DELETE_SESSION)
    .row()
    .text(ctx.t('admin-go-back'), CallbackQueryActions.GO_BACK);

export const getUsersInlineKeyboard = (ctx: BotContextType) =>
  new InlineKeyboard()
    .text(ctx.t('admin-get-all-users'), CallbackQueryActions.GET_ALL_USERS)
    .text(ctx.t('admin-add-user'), CallbackQueryActions.ADD_USER)
    .row()
    .text(ctx.t('admin-block-user'), CallbackQueryActions.BLOCK_USER)
    .text(ctx.t('admin-unblock-user'), CallbackQueryActions.UNBLOCK_USER)
    .row()
    .text(ctx.t('admin-go-back'), CallbackQueryActions.GO_BACK);
