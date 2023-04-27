import { i18n } from '../services';
import { BotContextType, TelegrafMiddlewareFn } from '../types';

export const auth =
  (allowUsersList: number[]): TelegrafMiddlewareFn<BotContextType> =>
  async (ctx, next) => {
    const userId = ctx?.update?.message?.from?.id ?? null;

    if (userId !== null && allowUsersList.includes(userId)) {
      return next();
    }

    await ctx.reply(i18n.translate('authError'));

    return;
  };
