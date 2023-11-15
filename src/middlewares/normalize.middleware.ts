import { updateClientMetadata, updateClientRate } from '@bot/api/clients';
import { BotContextType } from '@bot/app/types';
import { splitMessagesByTokenLimit } from '@bot/common/helpers/gpt.helpers';
import { isExpiredDate } from '@bot/common/utils';
import { GrammyMiddlewareFn } from '@bot/middlewares/types';
import { ONE_HOUR_MS } from 'common/constants';
import { differenceInMilliseconds, fromUnixTime } from 'date-fns';

export const normalize = (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
  const telegramId = Number(ctx.message?.from?.id);
  const locale = await ctx.i18n.getLocale();

  const sessionMessages = ctx.session.client.messages;
  const lastMessageTimestamp = ctx.session.client.lastMessageTimestamp;
  const rate = ctx.session.client.rate;

  ctx.session.client.metadata = {
    firstname: ctx?.from?.first_name || '',
    languageCode: locale,
    lastname: ctx?.from?.last_name || '',
    username: ctx?.from?.username || '',
  };

  if (rate && isExpiredDate(rate.expiresAt)) {
    const updatedClientRate = await updateClientRate(telegramId);

    ctx.session.client.rate = updatedClientRate;
  }

  const [headSessionMessages, tailSessionMessages] = splitMessagesByTokenLimit(sessionMessages);

  if (tailSessionMessages.length > 0) {
    ctx.session.client.messages = headSessionMessages;
  }

  if (differenceInMilliseconds(new Date(), fromUnixTime(lastMessageTimestamp)) >= ONE_HOUR_MS) {
    ctx.session.client.messages = [];

    await updateClientMetadata(telegramId, ctx.session.client.metadata);
  }

  return next();
};
