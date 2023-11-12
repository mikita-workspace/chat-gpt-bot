import { BotContextType } from '@bot/app/types';
import { splitMessagesByTokenLimit } from '@bot/common/helpers/gpt.helpers';
import { GrammyMiddlewareFn } from '@bot/middlewares/types';
import { ONE_HOUR_MS } from 'common/constants';
import { createInitialClientSessionData } from 'common/helpers';
import { differenceInMilliseconds, fromUnixTime } from 'date-fns';

export const normalize = (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
  const sessionMessages = ctx.session.client.messages;
  const lastMessageTimestamp = ctx.session.client.lastMessageTimestamp;

  // ctx.session.client = createInitialClientSessionData();

  ctx.session.client.metadata = {
    firstname: ctx?.from?.first_name || '',
    lastname: ctx?.from?.last_name || '',
    username: ctx?.from?.username || '',
  };

  const [headSessionMessages, tailSessionMessages] = splitMessagesByTokenLimit(sessionMessages);

  if (tailSessionMessages.length > 0) {
    ctx.session.client.messages = headSessionMessages;
  }

  if (differenceInMilliseconds(new Date(), fromUnixTime(lastMessageTimestamp)) >= ONE_HOUR_MS) {
    ctx.session.client.messages = [];
  }

  return next();
};
