import { giveClientFeedback } from '@bot/api/clients';
import { BotContextType } from '@bot/app/types';
import { FeedbackActions } from '@bot/common/constants';
import { CommonActions } from '@bot/common/constants';
import { changeGptModelConversation, generateImageConversation } from '@bot/conversations';
import { Composer, Middleware } from 'grammy';

const composer = new Composer<BotContextType>();

composer.callbackQuery(CommonActions.GO_TO_CHAT, async (ctx) => {
  await ctx.conversation.exit(changeGptModelConversation.name);
  await ctx.conversation.exit(generateImageConversation.name);

  await ctx.deleteMessage();
  await ctx.reply(ctx.t('start-message'));
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

    const [feedback, image] = callbackData.split('-');
    const isImageGenerator = image === 'image';

    const positiveFeedback = [
      ctx.t('feedback-like-response-first'),
      ctx.t('feedback-like-response-second'),
    ][Math.floor(Math.random() * 2)];

    const storeData = typeof ctx.session.store.data === 'string' ? ctx.session.store.data : '';

    const clientMessage = isImageGenerator
      ? storeData || callbackUpdateMessage?.text?.split(ctx.t('image-feedback'))[0]
      : callbackUpdateMessage?.text;

    await giveClientFeedback(telegramId, messageId, feedback);

    await ctx.deleteMessage();

    if (clientMessage && messageId) {
      await ctx.reply(clientMessage, {
        disable_web_page_preview: true,
        parse_mode: 'HTML',
        reply_to_message_id: messageId,
      });
    }

    ctx.session.store.data = null;

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
