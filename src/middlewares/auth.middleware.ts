import { i18n } from '../services';
import { BotContextType, GrammyMiddlewareFn } from '../types';

export const auth =
  (allowUsersList: string[]): GrammyMiddlewareFn<BotContextType> =>
  async (ctx, next) => {
    const userName = ctx?.update?.message?.from?.username ?? '';

    if (allowUsersList.includes(userName)) {
      return next();
    }

    await ctx.reply(i18n.translate('authError'));

    return;
  };
