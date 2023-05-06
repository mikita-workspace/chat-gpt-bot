import { mongo } from '../services';
import { fetchCachedData } from '../utils';
import { BotContextType, GrammyMiddlewareFn } from '../types';

export const auth =
  (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
    const userId =
      ctx?.update?.message?.from?.id ??
      ctx?.update?.callback_query?.from?.id ??
      '';
    const username =
      ctx?.update?.message?.from?.username ??
      ctx?.update?.callback_query?.from?.username ??
      '';

    const user = await fetchCachedData(`${userId}-${username}`, async () =>
      mongo.getUser(username),
    );

    if (user) {
      return next();
    }

    await ctx.reply(ctx.t('authError'));

    return;
  };
