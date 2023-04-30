import { BotContextType, TelegrafMiddlewareFn } from '../types';
import { isEmptyObject, setEmptySession } from '../utils';

export const normalize =
  (): TelegrafMiddlewareFn<BotContextType> => async (ctx, next) => {
    ctx.session = isEmptyObject(ctx.session) ? setEmptySession() : ctx.session;

    return next();
  };
