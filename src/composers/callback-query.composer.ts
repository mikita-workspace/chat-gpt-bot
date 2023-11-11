import { BotContextType } from '@bot/app/types';
import { FeedbackActions } from '@bot/common/constants';
import { CommonActions, UserImagesMenuActions } from '@bot/common/constants';
import { changeGptModelConversation, createImageConversation } from '@bot/conversations';
import { Composer, Middleware } from 'grammy';

const composer = new Composer<BotContextType>();

composer.callbackQuery(CommonActions.GO_TO_CHAT, async (ctx) => {
  await ctx.conversation.exit(createImageConversation.name);
  await ctx.conversation.exit(changeGptModelConversation.name);

  await ctx.deleteMessage();
  await ctx.reply(ctx.t('start-message'));
});

composer.callbackQuery(UserImagesMenuActions.CREATE_IMAGE, async (ctx) => {
  await ctx.deleteMessage();

  await ctx.conversation.enter(createImageConversation.name);
});

composer.callbackQuery([FeedbackActions.LIKE, FeedbackActions.DISLIKE], async (ctx) => {
  const callbackData = ctx.callbackQuery.data;
  const action = callbackData.slice(0, callbackData.indexOf('-')).trim();

  console.log(action);
});

export const callbackQueryComposer = (): Middleware<BotContextType> => composer;
