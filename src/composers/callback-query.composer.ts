import { giveClientFeedback } from '@bot/api/clients';
import { BotContextType } from '@bot/app/types';
import { FeedbackActions } from '@bot/common/constants';
import { ClientImagesMenuActions, CommonActions } from '@bot/common/constants';
import { changeGptModelConversation, generateImageConversation } from '@bot/conversations';
import { Composer, Middleware } from 'grammy';

const composer = new Composer<BotContextType>();

composer.callbackQuery(CommonActions.GO_TO_CHAT, async (ctx) => {
  await ctx.conversation.exit(generateImageConversation.name);
  await ctx.conversation.exit(changeGptModelConversation.name);

  await ctx.deleteMessage();
  await ctx.reply(ctx.t('start-message'));
});

composer.callbackQuery(ClientImagesMenuActions.GENERATE_IMAGE, async (ctx) => {
  await ctx.deleteMessage();

  await ctx.conversation.enter(generateImageConversation.name);
});

composer.callbackQuery(
  [
    FeedbackActions.DISLIKE,
    FeedbackActions.DISLIKE_IMAGE,
    FeedbackActions.LIKE,
    FeedbackActions.LIKE_IMAGE,
  ],
  async (ctx) => {
    const callbackData = ctx.callbackQuery.data as FeedbackActions;
    const callbackUpdateMessage = ctx.update.callback_query.message;

    const telegramId = Number(ctx?.from?.id);
    const messageId = Number(callbackUpdateMessage?.reply_to_message?.message_id);

    const [feedback, isImageGenerator] = callbackData.split('-');

    const positiveFeedback = [
      ctx.t('feedback-like-response-first'),
      ctx.t('feedback-like-response-second'),
    ][Math.floor(Math.random() * 2)];

    const clientMessage = callbackUpdateMessage?.text;

    await giveClientFeedback(telegramId, messageId, feedback);

    await ctx.deleteMessage();

    if (clientMessage && messageId && !isImageGenerator) {
      await ctx.reply(clientMessage, { reply_to_message_id: messageId });
    }

    if ([FeedbackActions.LIKE, FeedbackActions.LIKE_IMAGE].includes(callbackData)) {
      return ctx.reply(positiveFeedback);
    }

    return ctx.reply(
      ctx.t(
        isImageGenerator
          ? 'feedback-like-response-image-dislike'
          : 'feedback-like-response-dislike',
      ),
    );
  },
);

export const callbackQueryComposer = (): Middleware<BotContextType> => composer;
