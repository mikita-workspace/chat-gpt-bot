import { config } from '@bot/config';
import { BotCommands } from '@bot/constants';
import { inlineGoToChat } from '@bot/keyboards';
import { BotType } from '@bot/types';
import { fetchCachedData } from '@bot/utils';
import axios from 'axios';

export const aboutCommand = async (bot: BotType) =>
  bot.command(BotCommands.ABOUT, async (ctx) => {
    // const latestGithubRelease = await fetchCachedData(
    //   `cached-latest-github-release-${config.GITHUB_REPO}`,
    //   async () => {
    //     const response = await axios({
    //       method: 'get',
    //       url: latestReleaseGithubApiLink(config.GITHUB_USERNAME, config.GITHUB_REPO),
    //       headers: {
    //         Authorization: `Bearer ${config.GITHUB_TOKEN}`,
    //         Accept: 'application/vnd.github+json',
    //       },
    //     });
    //     return response.data;
    //   },
    // );
    // const { html_url: releaseUrl, name: releaseName, body: changelog } = latestGithubRelease;
    // ctx.reply(
    //   `${ctx.t('about-message-release', {
    //     release: releaseName,
    //   })}\n\r${releaseUrl}\n\r\n\r${changelog.replace(/@/gm, '')}`,
    //   {
    //     reply_markup: inlineGoToChat(ctx),
    //   },
    // );
  });
