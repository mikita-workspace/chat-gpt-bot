import { AuthActions, VoteActions } from '@bot/common/constants';
import {
  AdminMenuActions,
  CommonActions,
  ModeratorMenuActions,
  UserImagesMenuActions,
  UsersMenuActions,
} from '@bot/constants';
import { BotContextType } from '@bot/types';
import { InlineKeyboard, Keyboard } from 'grammy';

export const inlineGoToChat = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('common-button-go-to-chat'), CommonActions.GO_TO_CHAT);

export const inlineGoToAdminMenu = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('admin-menu-button-go-to-menu'), AdminMenuActions.GO_TO_MENU);

export const inlineGoToModeratorMenu = (ctx: BotContextType) =>
  new InlineKeyboard().text(
    ctx.t('moderator-menu-button-go-to-menu'),
    ModeratorMenuActions.GO_TO_MENU,
  );

export const inlineShareWithContacts = (ctx: BotContextType, query: string) =>
  new InlineKeyboard().switchInline(ctx.t('common-button-share'), query);

export const inlineCreateImage = (ctx: BotContextType) =>
  new InlineKeyboard().text(
    ctx.t('error-message-common-try-again'),
    UserImagesMenuActions.CREATE_IMAGE,
  );

export const inlineAuthButton = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('auth-button'), AuthActions.GET_AUTH);

export const inlineVoteButton = (ctx: BotContextType) => {
  const voteLabels = [
    [ctx.t('vote-like'), VoteActions.LIKE],
    [ctx.t('vote-dislike'), VoteActions.DISLIKE],
  ];
  const voteRow = voteLabels.map(([label, data]) => InlineKeyboard.text(label, data));

  return InlineKeyboard.from([voteRow]);
};

export const customKeyboard = (labels: string[]) => {
  const buttonRows = labels.map((label) => [Keyboard.text(label)]);

  return Keyboard.from(buttonRows).resized();
};
