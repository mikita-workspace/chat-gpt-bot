import { mongo } from '../services';
import { BotContextType, GrammyMiddlewareFn } from '../types';

export const auth = (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
  const username =
    ctx?.update?.message?.from?.username ?? ctx?.update?.callback_query?.from?.username ?? '';

  const user = await mongo.getUser(username);

  if (user.enabled) {
    return next();
  }

  await ctx.reply(ctx.t('error-auth'));

  return;
};
