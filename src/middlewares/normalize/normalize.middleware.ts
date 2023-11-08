import { DAY_MS } from '@bot/constants';
import { splitSessionMessagesByTokenLimit } from '@bot/helpers';
import { mongo } from '@bot/services';
import { BotContextType, GrammyMiddlewareFn } from '@bot/types';
import { getTimestampUnix, isExpiredDate } from '@bot/utils';

export const normalize = (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
  const username = String(ctx?.from?.username);
  const sessionMessages = ctx.session.client.messages;

  const user = await mongo.getUser(username);

  ctx.session.client.username ??= username;

  const [headSessionMessages, tailSessionMessages] =
    splitSessionMessagesByTokenLimit(sessionMessages);

  if (tailSessionMessages.length > 0) {
    ctx.session.client.messages = headSessionMessages;

    await mongo.updateUserConversation(username, tailSessionMessages);
  }

  if (user && isExpiredDate(user.limit.expire)) {
    // const selectedGPTModel = ctx.session.client.selectedGptModel;

    // ctx.session.settings = createInitialSettingsSessionData(selectedGPTModel);

    await mongo.updateUser(username, {
      limit: {
        ...user.limit,
        expire: 'test',
      },
    });
  }

  return next();
};
