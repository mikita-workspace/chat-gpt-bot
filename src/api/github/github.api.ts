import { GithubReleaseResponse } from '@bot/api/github/types';
import { TTL_CONFIG_CACHE_DEFAULT } from '@bot/common/constants';
import { fetchCachedData } from '@bot/common/utils';
import { config } from '@bot/config';
import { Logger } from '@bot/services';
import axios from 'axios';

export const getGithubReleases = async (): Promise<GithubReleaseResponse[]> => {
  try {
    const data = await fetchCachedData(
      'cached-github-releases',
      async () => {
        const response = await axios<GithubReleaseResponse[]>({
          method: 'get',
          url: `${config.CHAT_GPT_API_HOST}/v1/api/github/releases`,
        });

        return response.data;
      },
      TTL_CONFIG_CACHE_DEFAULT,
    );

    return data;
  } catch (error) {
    Logger.error(
      `src/api/github/github.api.ts::getGithubReleases::${JSON.stringify(error.message)}`,
    );

    return [];
  }
};
