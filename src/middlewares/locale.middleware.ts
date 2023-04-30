import { i18n } from '../services';
import { BotContextType, TelegrafMiddlewareFn } from '../types';

export const locale =
  (): TelegrafMiddlewareFn<BotContextType> => async (ctx, next) => {
    const userLanguageCode = ctx?.update?.message?.from?.language_code ?? 'en';

    i18n.setLocale(userLanguageCode);

    return next();
  };
