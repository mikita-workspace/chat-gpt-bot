import { AuthActions, VoteActions } from '@bot/common/constants';
import { BotContextType } from '@bot/types';
import { InlineKeyboard, Keyboard } from 'grammy';

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