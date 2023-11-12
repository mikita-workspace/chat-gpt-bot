import { BotContextType } from '@bot/app/types';
import { AuthActions, CommonActions, FeedbackActions } from '@bot/common/constants';
import { InlineKeyboard, Keyboard } from 'grammy';

export const inlineGoToChat = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('common-button-go-to-chat'), CommonActions.GO_TO_CHAT);

export const inlineShareWithContacts = (ctx: BotContextType, query: string) =>
  new InlineKeyboard().switchInline(ctx.t('common-button-share'), query);

export const inlineAuthButton = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('auth-button'), AuthActions.GET_AUTH);

export const inlineFeedback = (ctx: BotContextType, options?: { isImageGenerator?: boolean }) => {
  const feedbackLabels = [
    ...(options?.isImageGenerator
      ? [
          [ctx.t('feedback-like'), FeedbackActions.LIKE_IMAGE],
          [ctx.t('feedback-dislike'), FeedbackActions.DISLIKE_IMAGE],
        ]
      : [
          [ctx.t('feedback-like'), FeedbackActions.LIKE],
          [ctx.t('feedback-dislike'), FeedbackActions.DISLIKE],
        ]),
  ];
  const feedbackRow = feedbackLabels.map(([label, data]) => InlineKeyboard.text(label, data));

  return InlineKeyboard.from([feedbackRow]);
};

export const customKeyboard = (labels: string[]) => {
  const buttonRows = labels.map((label) => [Keyboard.text(label)]);

  return Keyboard.from(buttonRows).resized();
};
