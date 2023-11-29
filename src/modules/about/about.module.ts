import { getGithubReleases } from '@bot/api/github';
import { BotType } from '@bot/app/types';
import { BotCommand, botName, DATE_FORMAT } from '@bot/common/constants';
import { formatDate } from '@bot/common/utils';
import { inlineGoToChat } from '@bot/keyboards';

export const aboutModule = (bot: BotType) =>
  bot.command(BotCommand.ABOUT, async (ctx) => {
    const messageId = Number(ctx.message?.message_id);
    const locale = await ctx.i18n.getLocale();

    const { gpt, speech, image, vision } = ctx.session.selectedModel;

    const releases = await getGithubReleases();

    const releasesHtml = releases
      .map((release) => {
        const { repoName, name, htmlUrl, publishedAt } = release;

        return `<code>${repoName}</code>\n\r<a href="${htmlUrl}">${name}</a> (${formatDate(
          publishedAt,
          DATE_FORMAT,
          locale,
        )})\n\r`;
      })
      .join('');

    const profileMessageHtml = `${ctx.t('description-message-start', {
      botName: `<b>${botName}</b>`,
    })}\n\r${ctx.t('description-message-body')}\n\r\n\r<b>${ctx.t('about-gpt-model')}</b> ${
      gpt.title
    } (<code>${gpt.model}</code>)\n\r<b>${ctx.t('about-speech-model')}</b> ${speech.title} (<code>${
      speech.model
    }</code>)\n\r<b>${ctx.t('about-image-model')}</b> ${image.title} (<code>${image.model}</code>)${
      vision.title
        ? `\n\r<b>${ctx.t('about-vision-model')}</b> ${vision.title} (<code>${vision.model}</code>)`
        : ''
    }\n\r\n\r<b>${ctx.t('about-releases')}</b>\n\r${releasesHtml}`;

    return ctx.reply(profileMessageHtml, {
      disable_web_page_preview: true,
      parse_mode: 'HTML',
      reply_markup: inlineGoToChat(ctx),
      reply_to_message_id: messageId,
    });
  });
