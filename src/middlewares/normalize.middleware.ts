import { BotContextType, GrammyMiddlewareFn } from '../types';

export const normalize =
  (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
    const username =
      ctx?.update?.message?.from?.username ??
      ctx?.update?.callback_query?.from?.username ??
      '';

    ctx.session.username ??= username;

    return next();
  };
