import { createClient } from '@bot/api/clients';
import { BotContextType } from '@bot/app/types';
import { AuthActions, botName } from '@bot/common/constants';
import { removeValueFromMemoryCache } from '@bot/common/utils';
import { Composer, Middleware } from 'grammy';

const composer = new Composer<BotContextType>();

composer.callbackQuery(AuthActions.GET_AUTH, async (ctx) => {
  const telegramId = Number(ctx?.from?.id);
  const locale = await ctx.i18n.getLocale();

  const metadata = {
    firstname: ctx?.from?.first_name,
    languageCode: locale,
    lastname: ctx?.from?.last_name,
    username: ctx?.from?.username,
  };

  const client = await createClient(telegramId, metadata);

  await ctx.deleteMessage();

  if (client) {
    removeValueFromMemoryCache('cached-client-availability');

    return ctx.reply(ctx.t('auth-success', { botName }));
  }

  return ctx.reply(ctx.t('error-message-common'));
});

export const authQueryComposer = (): Middleware<BotContextType> => composer;
