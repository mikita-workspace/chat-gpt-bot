import { UserModel } from '../models';
import { fetchCachedData } from '../utils';
import { BotContextType, GrammyMiddlewareFn } from '../types';

export const auth =
  (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
    const userId = ctx?.update?.message?.from?.id ?? '';
    const username = ctx?.update?.message?.from?.username ?? '';

    const user = await fetchCachedData(`${userId}-${username}`, async () =>
      UserModel.findOne({ username }).exec(),
    );

    if (user) {
      return next();
    }

    await ctx.reply(ctx.t('authError'));

    return;
  };
