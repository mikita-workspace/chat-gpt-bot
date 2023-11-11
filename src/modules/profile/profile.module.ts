import { BotType } from '@bot/app/types';
import { BotCommands } from '@bot/common/constants';
import { expiresInDays } from '@bot/common/utils';
import { inlineGoToChat } from '@bot/keyboards';

export const profileModule = (bot: BotType) =>
  bot.command(BotCommands.PROFILE, async (ctx) => {
    const telegramId = Number(ctx.message?.from?.id);

    const metadata = ctx.session.client.metadata;
    const rate = ctx.session.client.rate;
    const selectedGpt = ctx.session.client.selectedGpt;

    const profileMessageHtml = `<b>${ctx.t('profile-client-initial-message', {
      firstname: metadata.firstname || '',
      lastname: metadata.lastname || '',
    })}</b>\n\r<a href="tg://user?id=${telegramId}">@${metadata.username}</a>\n\r\n\r${ctx.t(
      'profile-client-rate',
    )}<b> ${rate?.name}</b>\n\r${ctx.t('profile-client-select-model')}<b> ${
      selectedGpt.title
    }</b>\n\r\n\r${ctx.t('profile-client-available-messages')}<b><tg-spoiler> ${
      rate?.gptTokens
    }</tg-spoiler></b>\n\r${ctx.t('profile-client-available-images')}<b><tg-spoiler> ${
      rate?.dalleImages
    }</tg-spoiler></b>\n\r\n\r<b>${ctx.t('profile-client-date-expires', {
      expiresIn: expiresInDays(rate?.expiresAt || 0),
    })}</b>`;

    return ctx.reply(profileMessageHtml, { parse_mode: 'HTML', reply_markup: inlineGoToChat(ctx) });
  });
