import { getClientAvailability } from '@bot/api/clients';
import { splitMessagesByTokenLimit } from '@bot/common/helpers/gpt.helpers';
import { BotContextType, GrammyMiddlewareFn } from '@bot/types';

export const normalize = (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
  const username = String(ctx?.from?.username);
  const telegramId = Number(ctx?.from?.id);

  const sessionMessages = ctx.session.client.messages;

  const availability = await getClientAvailability(telegramId);

  if (availability) {
    ctx.session.client.username ??= username;
    ctx.session.client.models = availability.models;
  }

  const [headSessionMessages, tailSessionMessages] = splitMessagesByTokenLimit(sessionMessages);

  if (tailSessionMessages.length > 0) {
    ctx.session.client.messages = headSessionMessages;
  }

  // TODO: After inactive 60 min Client session should be cleared
  // const currentTimestamp = Date.now();
  // const lastMessageTimestamp = Math.min(
  //   ...ctx.session.client.messages.map(({ timestamp }) => new Date(timestamp).getTime()),
  // );

  // if (Math.abs(currentTimestamp - lastMessageTimestamp) >= TEN_MIN_MS) {
  //   updateUserConversationMessagesCallback(ctx, username);
  // }

  return next();
};
