import { MAX_SESSION_MESSAGES } from '@bot/constants';
import { BotContextType, GrammyMiddlewareFn } from '@bot/types';

export const normalize = (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
  const username = ctx?.from?.username ?? '';
  const sessionMessages = ctx.session.messages;

  ctx.session.username ??= username;
  ctx.session.conversation ??= {};

  if (sessionMessages.length >= MAX_SESSION_MESSAGES) {
    ctx.session.messages = sessionMessages.slice(Math.floor(MAX_SESSION_MESSAGES / 2.5));
  }

  return next();
};
