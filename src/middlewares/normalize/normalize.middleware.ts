import {
  DAY_MS,
  PER_DAY_GPT_IMAGE_LIMIT,
  PER_DAY_GPT_IMAGE_LIMIT_ADMIN,
  PER_DAY_GPT_TOKEN_LIMIT,
  PER_DAY_GPT_TOKEN_LIMIT_ADMIN,
  UserRoles,
} from '@bot/constants';
import { createInitialLimitSessionData, splitSessionMessagesByTokenLimit } from '@bot/helpers';
import { mongo } from '@bot/services';
import { BotContextType, GrammyMiddlewareFn } from '@bot/types';
import { parseTimestampUTC } from '@bot/utils';

export const normalize = (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
  const username = String(ctx?.from?.username);
  const sessionMessages = ctx.session.custom.messages;

  const user = await mongo.getUser(username);
  const currentUserRole = user?.role ?? UserRoles.USER;

  ctx.session.custom.username ??= username;

  const [headSessionMessages, tailSessionMessages] =
    splitSessionMessagesByTokenLimit(sessionMessages);

  if (tailSessionMessages.length > 0) {
    ctx.session.custom.messages = headSessionMessages;

    await mongo.updateUserConversation(username, tailSessionMessages);
  }

  if (user && new Date(user.limit.expire).getTime() <= Date.now()) {
    ctx.session.limit = createInitialLimitSessionData();

    await mongo.updateUser(username, {
      limit: {
        gptTokens: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN].includes(currentUserRole)
          ? PER_DAY_GPT_TOKEN_LIMIT_ADMIN
          : PER_DAY_GPT_TOKEN_LIMIT,
        gptImages: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN].includes(currentUserRole)
          ? PER_DAY_GPT_IMAGE_LIMIT_ADMIN
          : PER_DAY_GPT_IMAGE_LIMIT,
        expire: parseTimestampUTC(Date.now() + DAY_MS),
      },
    });
  }

  return next();
};
