import { getClientAvailability, updateClientAccountLevel } from '@bot/api/clients';
import { BotContextType } from '@bot/app/types';
import { splitMessagesByTokenLimit } from '@bot/common/helpers/gpt.helpers';
import { isExpiredDate } from '@bot/common/utils';

import { GrammyMiddlewareFn } from './types';

export const normalize = (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
  const telegramId = Number(ctx.message?.from?.id);
  const locale = await ctx.i18n.getLocale();

  const sessionMessages = ctx.session.client.messages;
  const clientAccountLevel = ctx.session.client.accountLevel;

  const availability = await getClientAvailability(telegramId);

  if (availability) {
    ctx.session.client.accountLevel = availability.accountLevel;
  }

  ctx.session.client.metadata = {
    firstname: ctx?.from?.first_name || '',
    languageCode: locale,
    lastname: ctx?.from?.last_name || '',
    username: ctx?.from?.username || '',
  };

  if (clientAccountLevel && isExpiredDate(clientAccountLevel.expiresAt)) {
    const updatedAccountLevel = await updateClientAccountLevel(telegramId);

    ctx.session.client.accountLevel = updatedAccountLevel;
  }

  const [headSessionMessages, tailSessionMessages] = splitMessagesByTokenLimit(sessionMessages);

  if (tailSessionMessages.length > 0) {
    ctx.session.client.messages = headSessionMessages;
  }

  return next();
};
