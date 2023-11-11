import { BotType } from '@bot/app/types';
import { BotCommands, botName } from '@bot/common/constants';
import { inlineGoToChat } from '@bot/keyboards';

export const aboutModule = (bot: BotType) =>
  bot.command(BotCommands.ABOUT, async (ctx) => {
    const messageId = Number(ctx.message?.message_id);

    const { gpt, speech } = ctx.session.client.selectedModel;

    // TODO: Get this value from github
    const release = 'release-3.0.0';

    const profileMessageHtml = `${ctx.t('description-message', { botName })}\n\r\n\r<b>${ctx.t(
      'about-gpt-model',
    )}<code> ${gpt.title} (${gpt.model})</code></b>\n\r<b>${ctx.t('about-speech-model')}<code> ${
      speech.title
    } (${speech.model})</code></b>\n\r<code>${release}</code>`;

    return ctx.reply(profileMessageHtml, {
      parse_mode: 'HTML',
      reply_markup: inlineGoToChat(ctx),
      reply_to_message_id: messageId,
    });
  });
