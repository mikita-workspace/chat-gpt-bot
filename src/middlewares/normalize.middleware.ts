import { MAX_SESSION_MESSAGES } from '@bot/constants';
import { BotContextType, GrammyMiddlewareFn } from '@bot/types';

export const normalize = (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
  const username =
    ctx?.update?.message?.from?.username ?? ctx?.update?.callback_query?.from?.username ?? '';
  const sessionMessages = ctx.session.messages;

  ctx.session.username ??= username;

  if (sessionMessages.length >= MAX_SESSION_MESSAGES) {
    ctx.session.messages = sessionMessages.slice(Math.floor(MAX_SESSION_MESSAGES / 3));
  }

  return next();
};
