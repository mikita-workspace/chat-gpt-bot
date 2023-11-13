import { BotType } from '@bot/app/types';
import { BotCommands } from '@bot/common/constants';
import { expiresInFormat } from '@bot/common/utils';
import { inlineGoToChat } from '@bot/keyboards';

export const profileModule = (bot: BotType) =>
  bot.command(BotCommands.PROFILE, async (ctx) => {
    const telegramId = Number(ctx.message?.from?.id);
    const messageId = Number(ctx.message?.message_id);
    const locale = String(ctx.from?.language_code);

    const metadata = ctx.session.client.metadata;
    const rate = ctx.session.client.rate;

    const profileMessageHtml = `<b>${ctx.t('profile-client-initial-message', {
      firstname: metadata.firstname || ctx.t('profile-client-incognito'),
      lastname: metadata.lastname || '',
    })}</b>\n\r<a href="tg://user?id=${telegramId}">@${
      metadata.username || 'username'
    }</a>\n\r\n\r${
      rate
        ? `${ctx.t('profile-client-rate')}<b> ${rate.name} ${rate.symbol}</b>\n\r\n\r${ctx.t(
            'profile-client-available-messages',
          )}<b><tg-spoiler> ${rate.gptTokens}</tg-spoiler></b>\n\r${ctx.t(
            'profile-client-available-images',
          )}<b><tg-spoiler> ${rate.images}</tg-spoiler></b>\n\r\n\r<b>${ctx.t(
            'profile-client-date-expires',
            {
              expiresIn: expiresInFormat(rate.expiresAt, locale),
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
