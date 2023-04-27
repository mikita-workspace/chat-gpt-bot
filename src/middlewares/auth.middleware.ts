import { i18n } from '../services';
import { BotContextType, TelegrafMiddlewareFn } from '../types';

export const auth =
  (allowUsersList: string[]): TelegrafMiddlewareFn<BotContextType> =>
  async (ctx, next) => {
    const userName = ctx?.update?.message?.from?.username ?? '';

    if (allowUsersList.includes(userName)) {
      return next();
    }

    await ctx.reply(i18n.translate('authError'));

    return;
  };
