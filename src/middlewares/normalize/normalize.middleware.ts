import { DAY_MS } from '@bot/constants';
import { createInitialLimitSessionData, splitSessionMessagesByTokenLimit } from '@bot/helpers';
import { mongo } from '@bot/services';
import { BotContextType, GrammyMiddlewareFn } from '@bot/types';
import { parseTimestampUTC } from '@bot/utils';

export const normalize = (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
  const username = String(ctx?.from?.username);
  const sessionMessages = ctx.session.user.messages;

  const user = await mongo.getUser(username);

  ctx.session.user.username ??= username;

  const [headSessionMessages, tailSessionMessages] =
    splitSessionMessagesByTokenLimit(sessionMessages);

  if (tailSessionMessages.length > 0) {
    ctx.session.user.messages = headSessionMessages;

    await mongo.updateUserConversation(username, tailSessionMessages);
  }

  if (user && new Date(user.limit.expire).getTime() <= Date.now()) {
    ctx.session.limit = createInitialLimitSessionData();

    await mongo.updateUser(username, {
      limit: {
        ...user.limit,
        expire: parseTimestampUTC(Date.now() + DAY_MS),
      },
    });
  }

  return next();
};
