import { UserModel } from '../models';
import { BotContextType, GrammyMiddlewareFn } from '../types';

export const auth =
  (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
    const username = ctx?.update?.message?.from?.username ?? '';

    const isAccessAllowed = await UserModel.findOne({ username }).exec();

    if (isAccessAllowed) {
      return next();
    }

    await ctx.reply(ctx.t('authError'));

    return;
  };
