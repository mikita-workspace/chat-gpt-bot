import { BotCommands, GPTLimits } from '@bot/constants';
import { inlineGoToChat } from '@bot/keyboards';
import { mongo } from '@bot/services';
import { BotType } from '@bot/types';
import { getKeyByValue, getTimezoneString } from '@bot/utils';

export const profileCommand = (bot: BotType) =>
  bot.command(BotCommands.PROFILE, async (ctx) => {
    const currentLocale = await ctx.i18n.getLocale();

    const user = await mongo.getUser(String(ctx.from?.username));

    if (user) {
      const userLimit = ctx.session.limit;
      const timestamp = new Date(user.timestamp);
      const gptLimitPackage = getKeyByValue(
        GPTLimits,
        `${user.limit.gptTokens}/${user.limit.gptImages}`,
      ).toLowerCase();

      await ctx.reply(
        `${ctx.t('profile-user-initial-message')}\n\r\n\r${ctx.t('profile-user-role', {
          role: ctx.t(`user-role-${user?.role}`),
        })}\n\r${ctx.t('profile-user-gpt-package', {
          package: ctx.t(`user-gpt-limit-${gptLimitPackage}`),
        })}\n\r${ctx.t('profile-user-available-messages-amount', {
          amount: Math.max(user.limit.gptTokens - userLimit.amountOfGptTokens, 0),
        })}\n\r${ctx.t('profile-user-available-images-amount', {
          amount: Math.max(user.limit.gptImages - userLimit.amountOfGptImages, 0),
        })}\n\r\n\r${ctx.t('profile-user-date-register', {
          date: timestamp.toLocaleString(currentLocale),
          utc: getTimezoneString(timestamp.getTimezoneOffset()),
        })}`,
        {
          reply_markup: inlineGoToChat(ctx),
        },
      );
    }
  });
