import { BotCommands } from '@bot/constants';
import { inlineGoToChat } from '@bot/keyboards';
import { mongo } from '@bot/services';
import { BotType } from '@bot/types';

export const profileCommand = (bot: BotType) =>
  bot.command(BotCommands.PROFILE, async (ctx) => {
    const currentLocale = await ctx.i18n.getLocale();

    const user = await mongo.getUser(String(ctx.from?.username));
    const userLimit = ctx.session.limit;

    if (user) {
      await ctx.reply(
        `${ctx.t('profile-user-initial-message')}\n\r\n\r${ctx.t('profile-user-role', {
          role: ctx.t(`user-role-${user?.role}`),
        })}\n\r${ctx.t('profile-user-available-messages-amount', {
          amount: Math.max(user.limit.gptTokens - userLimit.amountOfGptTokens, 0),
        })}\n\r${ctx.t('profile-user-available-images-amount', {
          amount: Math.max(user.limit.gptImages - userLimit.amountOfGptImages, 0),
        })}\n\r\n\r${ctx.t('profile-user-date-register', {
          date: new Date(user.timestamp).toLocaleString(currentLocale),
        })}`,
        {
          reply_markup: inlineGoToChat(ctx),
        },
      );
    }
  });
