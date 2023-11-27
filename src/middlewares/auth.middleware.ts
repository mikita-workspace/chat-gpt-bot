import { getClientAvailability } from '@bot/api/clients';
import { BotContextType } from '@bot/app/types';
import { inlineAuthButton } from '@bot/keyboards';
import { Logger } from '@bot/services';
import { BotCommand } from 'common/constants';

import { GrammyMiddlewareFn } from './types';

export const auth = (): GrammyMiddlewareFn<BotContextType> => async (ctx, next) => {
  try {
    const username = ctx?.from?.username;
    const telegramId = Number(ctx?.from?.id);
    const messageId = Number(ctx?.message?.message_id);

    const isSupportCommand = ctx?.message?.text?.slice(1) === BotCommand.SUPPORT;

    Logger.defaultMeta = { username, telegramId };

    if (isSupportCommand) {
      return await next();
    }

    const availability = await getClientAvailability(telegramId);

    if (!availability) {
      await ctx.reply(ctx.t('auth-authorization'), {
        reply_to_message_id: messageId,
        reply_markup: inlineAuthButton(ctx),
      });

      return;
    }

    const { isApproved, isBlocked } = availability.state;

    if (isApproved && !isBlocked) {
      return await next();
    }

    if (!isApproved) {
      await ctx.reply(ctx.t('auth-approval'));

      return;
    }

    if (isBlocked) {
      await ctx.reply(`${ctx.t('auth-block')} ${ctx.t('support-contact')}`);

      return;
    }

    await ctx.reply(`${ctx.t('auth-error')} ${ctx.t('support-contact')}`);

    return;
  } catch (error) {
    console.log(error);
    return;
  }
};
