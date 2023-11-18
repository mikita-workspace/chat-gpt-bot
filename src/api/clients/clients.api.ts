import {
  ClientAvailabilityResponse,
  ClientFeedbackResponse,
  ClientMetadata,
  ClientMetadataResponse,
  ClientRate,
  ClientResponse,
} from '@bot/api/clients/types';
import { fetchCachedData } from '@bot/common/utils';
import { config } from '@bot/config';
import { Logger } from '@bot/services';
import axios, { HttpStatusCode } from 'axios';

export const createClient = async (
  telegramId: number,
  metadata: {
    firstname?: string;
    lastname?: string;
    username?: string;
    languageCode: string;
  },
) => {
  try {
    const response = await axios<ClientResponse>({
      method: 'post',
      data: { telegramId, metadata },
      url: `${config.CHAT_GPT_API_HOST}/v1/api/clients`,
    });

    return response.data;
  } catch (error) {
    Logger.error({
      context: 'src/api/clients/clients.api.ts::createClient',
      message: error.message,
      stack: JSON.stringify(error),
    });

    return null;
  }
};

export const getClientAvailability = async (
  telegramId: number,
): Promise<ClientAvailabilityResponse | null> => {
  try {
    const clientAvailability = await fetchCachedData('cached-client-availability', async () => {
      const response = await axios<ClientAvailabilityResponse>({
        method: 'get',
        url: `${config.CHAT_GPT_API_HOST}/v1/api/clients/availability/${telegramId}`,
      });

      return response.data;
    });

    return clientAvailability;
  } catch (error) {
    if (error.response && error.response.status !== HttpStatusCode.NotFound) {
      Logger.error({
        context: 'src/api/clients/clients.api.ts::getClientAvailability',
        message: error.message,
        stack: JSON.stringify(error),
      });
    }

    return null;
  }
};

export const giveClientFeedback = async (
  telegramId: number,
  messageId: number,
  feedback: string,
) => {
  try {
    const response = await axios<ClientFeedbackResponse>({
      method: 'post',
      data: { telegramId, messageId, feedback },
      url: `${config.CHAT_GPT_API_HOST}/v1/api/clients/feedback`,
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status !== HttpStatusCode.NotFound) {
      Logger.error({
        context: 'src/api/clients/clients.api.ts::giveClientFeedback',
        message: error.message,
        stack: JSON.stringify(error),
      });
    }

    return null;
  }
};

export const updateClientRate = async (telegramId: number) => {
  try {
    const response = await axios<ClientRate>({
      method: 'post',
      data: {
        telegramId,
      },
      url: `${config.CHAT_GPT_API_HOST}/v1/api/clients/rate`,
    });

    return response.data;
  } catch (error) {
    Logger.error({
      context: 'src/api/clients/clients.api.ts::updateClientRate',
      message: error.message,
      stack: JSON.stringify(error),
    });

    return null;
  }
};

export const updateClientMetadata = async (telegramId: number, metadata: ClientMetadata) => {
  try {
    const response = await axios<ClientMetadataResponse>({
      method: 'post',
      data: {
        telegramId,
        metadata,
      },
      url: `${config.CHAT_GPT_API_HOST}/v1/api/clients/metadata`,
    });

    return response.data;
  } catch (error) {
    Logger.error({
      context: 'src/api/clients/clients.api.ts::updateClientMetadata',
      message: error.message,
      stack: JSON.stringify(error),
    });

    return null;
  }
};
