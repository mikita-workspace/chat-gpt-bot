import { UserRoles } from '@bot/constants';
import { mongo } from '@bot/services';
import { BotContextType, GrammyMiddlewareFn } from '@bot/types';

export const auth = (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
  const username =
    ctx?.update?.message?.from?.username ?? ctx?.update?.callback_query?.from?.username ?? '';
  const action = ctx?.update?.message?.text ?? '';

  const user = await mongo.getUser(username);

  if (user?.enabled) {
    if (action === '/admin' && user?.role !== UserRoles.ADMIN) {
      await ctx.reply(ctx.t('error-auth-admin'));

      return;
    }

    return next();
  }

  await ctx.reply(ctx.t('error-auth'));

  return;
};
