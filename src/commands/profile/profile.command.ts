import { BotCommands, PER_DAY_GPT_IMAGE_LIMIT, PER_DAY_GPT_TOKEN_LIMIT } from '@bot/constants';
import { getAmountOfTokensForSessionMessages } from '@bot/helpers';
import { inlineGoToChat } from '@bot/keyboards';
import { mongo } from '@bot/services';
import { BotType, SessionModelType, UserModelType } from '@bot/types';

export const profileCommand = (bot: BotType) =>
  bot.command(BotCommands.PROFILE, async (ctx) => {
    const currentLocale = await ctx.i18n.getLocale();
    const currentUser = String(ctx.from?.username);

    const user: UserModelType = await mongo.getUser(String(ctx.from?.username));
    const userSession: SessionModelType = await mongo.getUserSession(currentUser);

    const amountOfTokens = getAmountOfTokensForSessionMessages(userSession.value.messages);

    await ctx.reply(
      `${ctx.t('profile-user-initial-message')}\n\r\n\r${ctx.t('profile-user-role', {
        role: ctx.t(`user-role-${user.role}`),
      })}\n\r${ctx.t('profile-user-available-messages-amount', {
        amount: Math.max(PER_DAY_GPT_TOKEN_LIMIT - amountOfTokens, 0),
      })}\n\r${ctx.t('profile-user-available-images-amount', {
        amount: PER_DAY_GPT_IMAGE_LIMIT,
      })}\n\r\n\r${ctx.t('profile-user-date-register', {
        date: new Date(user.timestamp).toLocaleString(currentLocale),
      })}`,
      {
        reply_markup: inlineGoToChat(ctx),
      },
    );
  });
