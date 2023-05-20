import { CUT_NUMBER_OF_SESSION_MESSAGES_TAIL, MAX_SESSION_MESSAGES } from '@bot/constants';
import { mongo } from '@bot/services';
import { BotContextType, GrammyMiddlewareFn } from '@bot/types';

export const normalize = (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
  const username = ctx?.from?.username ?? '';
  const sessionMessages = ctx.session.custom.messages;

  ctx.session.custom.username ??= username;

  if (sessionMessages.length >= MAX_SESSION_MESSAGES) {
    const slicedSessionMessages = sessionMessages.slice(CUT_NUMBER_OF_SESSION_MESSAGES_TAIL);
    const tailSessionMessages = sessionMessages.slice(0, CUT_NUMBER_OF_SESSION_MESSAGES_TAIL);

    await mongo.updateUserConversation(username, tailSessionMessages);

    ctx.session.custom.messages = slicedSessionMessages;
  }

  return next();
};
