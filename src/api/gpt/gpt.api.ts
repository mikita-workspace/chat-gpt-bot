import {
  ChatCompletionResponse,
  GenerateImagesResponse,
  GptModelResponse,
  TranscriptionResponse,
  VisionCompletionResponse,
} from '@bot/api/gpt/types';
import { fetchCachedData } from '@bot/common/utils';
import { config } from '@bot/config';
import { Logger } from '@bot/services';
import axios from 'axios';

export const getGptModels = async (telegramId: number): Promise<GptModelResponse[]> => {
  try {
    const data = await fetchCachedData(`cached-gpt-models-${telegramId}`, async () => {
      const response = await axios<GptModelResponse[]>({
        method: 'get',
        data: {
          telegramId,
        },
        url: `${config.CHAT_GPT_API_HOST}/api/v1/gpt/models`,
      });

      return response.data;
    });

    return data;
  } catch (error) {
    Logger.error({
      context: 'src/api/gpt/gpt.api.ts::getGptModels',
      message: error.message,
      stack: JSON.stringify(error),
    });

    return [];
  }
};

export const chatCompletion = async (
  messages: ChatCompletionResponse['message'][],
  messageId: number,
  telegramId: number,
  model: string,
) => {
  try {
    const response = await axios<ChatCompletionResponse>({
      method: 'post',
      data: {
        messages,
        messageId,
        model,
        telegramId,
      },
      url: `${config.CHAT_GPT_API_HOST}/api/v1/gpt/chatCompletions`,
    });

    return response.data;
  } catch (error) {
    Logger.error({
      context: 'src/api/gpt/gpt.api.ts::chatCompletion',
      message: error.message,
      stack: JSON.stringify(error),
    });

    return null;
  }
};

export const transcription = async (filename: string, telegramId: number, model: string) => {
  try {
    const response = await axios<TranscriptionResponse>({
      method: 'post',
      data: {
        filename,
        telegramId,
        model,
      },
      url: `${config.CHAT_GPT_API_HOST}/api/v1/gpt/transcriptions`,
    });

    return response.data;
  } catch (error) {
    Logger.error({
      context: 'src/api/gpt/gpt.api.ts::transcription',
      message: error.message,
      stack: JSON.stringify(error),
    });

    return null;
  }
};

export const generateImages = async (
  telegramId: number,
  messageId: number,
  model: string,
  query: { amount: number; prompt: string },
) => {
  const useCloudinary = config.USE_CLOUDINARY === 'true';

  try {
    const response = await axios<GenerateImagesResponse>({
      method: 'post',
      data: {
        telegramId,
        messageId,
        model,
        useCloudinary,
        ...query,
      },
      url: `${config.CHAT_GPT_API_HOST}/api/v1/gpt/generateImages`,
    });

    return response.data;
  } catch (error) {
    Logger.error({
      context: 'src/api/gpt/gpt.api.ts::generateImages',
      message: error.message,
      stack: JSON.stringify(error),
    });

    return null;
  }
};

export const visionCompletion = async (
  message: string,
  messageId: number,
  filename: string,
  telegramId: number,
  model: string,
) => {
  const useCloudinary = config.USE_CLOUDINARY === 'true';

  try {
    const response = await axios<VisionCompletionResponse>({
      method: 'post',
      data: {
        filename,
        message,
        messageId,
        model,
        telegramId,
        useCloudinary,
      },
      url: `${config.CHAT_GPT_API_HOST}/api/v1/gpt/visionCompletions`,
    });

    return response.data;
  } catch (error) {
    Logger.error({
      context: 'src/api/gpt/gpt.api.ts::visionCompletion',
      message: error.message,
      stack: JSON.stringify(error),
    });

    return null;
  }
};
