import { BotContextType } from '@bot/app/types';
import { AuthAction, CommonAction, FeedbackAction } from '@bot/common/constants';
import { chunkIntoN } from '@bot/common/utils';
import { InlineKeyboard, Keyboard } from 'grammy';

export const inlineGoToChat = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('common-button-go-to-chat'), CommonAction.GO_TO_CHAT);

export const inlineShareWithContacts = (ctx: BotContextType, query: string) =>
  new InlineKeyboard().switchInline(ctx.t('common-button-share'), query);

export const inlineAuthButton = (ctx: BotContextType) =>
  new InlineKeyboard().text(ctx.t('auth-button'), AuthAction.GET_AUTH);

export const inlineFeedback = (ctx: BotContextType, options?: { isImageGenerator?: boolean }) => {
  const feedbackLabels = [
    ...(options?.isImageGenerator
      ? [
          [ctx.t('feedback-smile'), FeedbackAction.SMILE_IMAGE],
          [ctx.t('feedback-zany'), FeedbackAction.ZANY_IMAGE],
          [ctx.t('feedback-neutral'), FeedbackAction.NEUTRAL_IMAGE],
          [ctx.t('feedback-cry'), FeedbackAction.CRY_IMAGE],
        ]
      : [
          [ctx.t('feedback-like'), FeedbackAction.LIKE],
          [ctx.t('feedback-dislike'), FeedbackAction.DISLIKE],
        ]),
  ];
  const feedbackRow = feedbackLabels.map(([label, data]) => InlineKeyboard.text(label, data));

  return InlineKeyboard.from([feedbackRow]);
};

export const gptKeyboard = (models: string[]) => {
  const buttonRows = chunkIntoN(models, 2);

  return Keyboard.from(buttonRows).resized();
};

export const supportKeyboard = (topics: string[]) => {
  const buttonRows = chunkIntoN(topics, 2);

  return Keyboard.from(buttonRows).resized();
};
