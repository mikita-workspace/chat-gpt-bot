import { config } from '@bot/config';
import { UserRoles } from '@bot/constants';
import { mongo } from '@bot/services';
import { BotContextType, GrammyMiddlewareFn } from '@bot/types';

export const auth = (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
  const username = String(ctx?.from?.username);
  const action = String(ctx?.update?.message?.text);

  if (username === config.SUPER_ADMIN_USERNAME) {
    return next();
  }

  const user = await mongo.getUser(username);

  if (user?.enabled) {
    if (action === '/admin' && user?.role !== UserRoles.ADMIN) {
      await ctx.reply(ctx.t('error-message-auth-admin'));

      return;
    }

    return next();
  }

  await ctx.reply(ctx.t('error-message-auth'));

  return;
};
