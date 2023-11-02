import { DAY_MS } from '@bot/constants';
import { createInitialSettingsSessionData, splitSessionMessagesByTokenLimit } from '@bot/helpers';
import { mongo } from '@bot/services';
import { BotContextType, GrammyMiddlewareFn } from '@bot/types';
import { isExpiredDate, parseTimestampUTC } from '@bot/utils';

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

  if (user && isExpiredDate(user.limit.expire)) {
    const selectedGPTModel = ctx.session.settings.selectedGPTModel;

    ctx.session.settings = createInitialSettingsSessionData(selectedGPTModel);

    await mongo.updateUser(username, {
      limit: {
        ...user.limit,
        expire: parseTimestampUTC(Date.now() + DAY_MS),
      },
    });
  }

  return next();
};
