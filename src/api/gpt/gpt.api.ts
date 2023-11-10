import { ChatCompletionResponse, GptModelsResponse } from '@bot/api/gpt/types';
import { config } from '@bot/config';
import { logger } from '@bot/services';
import { fetchCachedData } from '@bot/utils';
import axios from 'axios';

export const getGptModels = async (): Promise<GptModelsResponse[]> => {
  try {
    const data = await fetchCachedData('cached-gpt-models', async () => {
      const response = await axios<GptModelsResponse[]>({
        method: 'get',
        url: `${config.CHAT_GPT_API_HOST}/v1/api/gpt/models`,
      });

      return response.data;
    });

    return data;
  } catch (error) {
    logger.error(`src/api/gpt/gpt.api.ts::getGptModels::${JSON.stringify(error.message)}`);

    return [];
  }
};

export const chatCompletion = async (
  model: string,
  messages: ChatCompletionResponse['message'][],
  telegramId: number,
) => {
  try {
    const response = await axios<ChatCompletionResponse>({
      method: 'post',
      data: {
        model,
        messages,
        telegramId,
      },
      url: `${config.CHAT_GPT_API_HOST}/v1/api/gpt/chatCompletions`,
    });

    return response.data;
  } catch (error) {
    logger.error(`src/api/gpt/gpt.api.ts::chatCompletion::${JSON.stringify(error.message)}`);

    return null;
  }
};

export const transcription = async (voicePathApi: string, telegramId: number) => {
  try {
    const response = await axios<string>({
      method: 'post',
      data: {
        voicePathApi,
        telegramId,
      },
      url: `${config.CHAT_GPT_API_HOST}/v1/api/gpt/transcriptions`,
    });

    return response.data;
  } catch (error) {
    logger.error(`src/api/gpt/gpt.api.ts::transcription::${JSON.stringify(error.message)}`);

    return null;
  }
};