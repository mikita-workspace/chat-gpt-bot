import { CUT_NUMBER_OF_SESSION_MESSAGES_TAIL, MAX_SESSION_MESSAGES } from '@bot/constants';
import { BotContextType, GrammyMiddlewareFn } from '@bot/types';

export const normalize = (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
  const username = ctx?.from?.username ?? '';
  const sessionMessages = ctx.session.custom.messages;

  ctx.session.custom.username ??= username;

  if (sessionMessages.length >= MAX_SESSION_MESSAGES) {
    ctx.session.custom.messages = sessionMessages.slice(CUT_NUMBER_OF_SESSION_MESSAGES_TAIL);
  }

  return next();
};
