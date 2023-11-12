import { getGithubReleases } from '@bot/api/github';
import { BotType } from '@bot/app/types';
import { BotCommands, botName, DATE_FORMAT } from '@bot/common/constants';
import { formatDate } from '@bot/common/utils';
import { inlineGoToChat } from '@bot/keyboards';

export const aboutModule = (bot: BotType) =>
  bot.command(BotCommands.ABOUT, async (ctx) => {
    const messageId = Number(ctx.message?.message_id);
    const locale = String(ctx.from?.language_code);

    const { gpt, speech, image } = ctx.session.client.selectedModel;

    const releases = await getGithubReleases();

    const releasesHtml = releases
      .map((release) => {
        const { repoName, name, htmlUrl, publishedAt } = release;

        return `<code>${repoName}</code>\n\r<a href="${htmlUrl}">${name}</a> (${formatDate(
          new Date(publishedAt),
          DATE_FORMAT,
          locale,
        )})\n\r`;
      })
      .join('');

    const profileMessageHtml = `${ctx.t('description-message-start', {
      botName,
    })}\n\r${ctx.t('description-message-body')}\n\r\n\r<b>${ctx.t('about-gpt-model')}<code> ${
      gpt.title
    } (${gpt.model})</code></b>\n\r<b>${ctx.t('about-speech-model')}<code> ${speech.title} (${
      speech.model
    })</code></b>\n\r<b>${ctx.t('about-image-model')}<code> ${image.title} (${
      image.model
    })</code></b>\n\r\n\r<b>${ctx.t('about-releases')}</b>\n\r${releasesHtml}`;

    return ctx.reply(profileMessageHtml, {
      parse_mode: 'HTML',
      reply_markup: inlineGoToChat(ctx),
      reply_to_message_id: messageId,
    });
  });
