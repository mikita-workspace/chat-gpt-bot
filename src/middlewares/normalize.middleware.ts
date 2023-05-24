import { splitSessionMessagesByTokenLimit } from '@bot/helpers';
import { mongo } from '@bot/services';
import { BotContextType, GrammyMiddlewareFn } from '@bot/types';

export const normalize = (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
  const username = String(ctx?.from?.username);
  const sessionMessages = ctx.session.custom.messages;

  ctx.session.custom.username ??= username;

  const [headSessionMessages, tailSessionMessages] =
    splitSessionMessagesByTokenLimit(sessionMessages);

  if (tailSessionMessages.length > 0) {
    ctx.session.custom.messages = headSessionMessages;

    await mongo.updateUserConversation(username, tailSessionMessages);
  }

  return next();
};
