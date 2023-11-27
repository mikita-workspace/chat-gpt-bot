import { fetchCachedData } from '@bot/common/utils';
import { config } from '@bot/config';
import { Logger } from '@bot/services';
import axios from 'axios';

import { CsmIssueResponse, CsmTopicResponse } from './types';

export const getCsmTopics = async (telegramId: number): Promise<CsmTopicResponse[]> => {
  try {
    const data = await fetchCachedData(`cached-csm-topics-${telegramId}`, async () => {
      const response = await axios<CsmTopicResponse[]>({
        method: 'get',
        url: `${config.CHAT_GPT_API_HOST}/api/v1/csm/topic`,
      });

      return response.data;
    });

    return data;
  } catch (error) {
    Logger.error({
      context: 'src/api/csm/csm.api.ts::getCsmTopics',
      message: error.message,
      stack: JSON.stringify(error),
    });

    return [];
  }
};

export const createCsmIssue = async (telegramId: number, key: string, description: string) => {
  try {
    const response = await axios<CsmIssueResponse>({
      method: 'post',
      data: {
        description,
        key,
        telegramId,
      },
      url: `${config.CHAT_GPT_API_HOST}/api/v1/csm`,
    });

    return response.data;
  } catch (error) {
    Logger.error({
      context: 'src/api/csm/csm.api.ts::createCsmIssue',
      message: error.message,
      stack: JSON.stringify(error),
    });

    return null;
  }
};
