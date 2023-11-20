import { fetchCachedData } from '@bot/common/utils';
import { config } from '@bot/config';
import { Logger } from '@bot/services';
import axios from 'axios';

import { GithubReleaseResponse } from './types';

export const getGithubReleases = async (): Promise<GithubReleaseResponse[]> => {
  try {
    const data = await fetchCachedData(
      'cached-github-releases',
      async () => {
        const response = await axios<GithubReleaseResponse[]>({
          method: 'get',
          url: `${config.CHAT_GPT_API_HOST}/api/v1/github/releases`,
        });

        return response.data;
      },
      config.TTL_CONFIG_CACHE,
    );

    return data;
  } catch (error) {
    Logger.error({
      context: 'src/api/github/github.api.ts::getGithubReleases',
      message: error.message,
      stack: JSON.stringify(error),
    });

    return [];
  }
};
