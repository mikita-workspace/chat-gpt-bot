import { createClient } from '@bot/api/clients';
import { BotContextType } from '@bot/app/types';
import { BotLanguageCodes } from '@bot/common/constants';
import { AuthActions, botName, CommonActions, UserImagesMenuActions } from '@bot/common/constants';
import { removeValueFromMemoryCache } from '@bot/common/utils';
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

composer.callbackQuery(AuthActions.GET_AUTH, async (ctx) => {
  const telegramId = Number(ctx?.from?.id);
  const metadata = {
    firstname: ctx?.from?.first_name,
    lastname: ctx?.from?.last_name,
    username: ctx?.from?.username,
  };
  const languageCode = ctx?.from?.language_code as BotLanguageCodes;

  const client = await createClient(telegramId, metadata, languageCode);

  await ctx.deleteMessage();

  if (client) {
    removeValueFromMemoryCache('cached-client-availability');

    return ctx.reply(ctx.t('auth-success', { botName }));
  }

  return ctx.reply(ctx.t('error-message-common'));
});

export const callbackQueryComposer = (): Middleware<BotContextType> => composer;
