import { PROMO_ACCOUNT_LEVEL } from '@bot/api/clients/constants';
import { BotType } from '@bot/app/types';
import { BotCommand } from '@bot/common/constants';
import { expiresInFormat } from '@bot/common/utils';
import { inlineGoToChat } from '@bot/keyboards';
import { getClientAvailability } from 'api/clients';

export const profileModule = (bot: BotType) =>
  bot.command(BotCommand.PROFILE, async (ctx) => {
    const telegramId = Number(ctx.message?.from?.id);
    const messageId = Number(ctx.message?.message_id);
    const locale = await ctx.i18n.getLocale();

    const availability = await getClientAvailability(telegramId);
    ctx.session.client.accountLevel = availability?.accountLevel ?? null;

    const clientAccountLevel = ctx.session.client.accountLevel;
    const metadata = ctx.session.client.metadata;

    const profileMessageHtml = `<b>${ctx.t('profile-client-initial-message', {
      firstname: metadata.firstname || ctx.t('profile-client-incognito'),
      lastname: metadata.lastname || '',
    })}</b>\n\r<a href="tg://user?id=${telegramId}">@${
      metadata.username || 'username'
    }</a>\n\r\n\r${
      clientAccountLevel
        ? `<b>${clientAccountLevel.name} ${clientAccountLevel.symbol}</b>\n\r\n\r${ctx.t(
            'profile-client-available-messages',
          )}<b><tg-spoiler> ${clientAccountLevel.gptTokens}</tg-spoiler></b>\n\r${ctx.t(
            'profile-client-available-images',
          )}<b><tg-spoiler> ${clientAccountLevel.images}</tg-spoiler></b>\n\r\n\r<b>${ctx.t(
            clientAccountLevel.name === PROMO_ACCOUNT_LEVEL
              ? 'profile-client-promo-date-expires'
              : 'profile-client-date-expires',
            {
              expiresIn: expiresInFormat(clientAccountLevel.expiresAt, locale),
            },
          )}</b>`
        : `<b>${ctx.t('profile-client-unavailable-info')}</b>`
    }`;

    return ctx.reply(profileMessageHtml, {
      parse_mode: 'HTML',
      reply_markup: inlineGoToChat(ctx),
      reply_to_message_id: messageId,
    });
  });
