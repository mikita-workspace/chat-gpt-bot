import { fetchCachedData } from '@bot/common/utils';
import { config } from '@bot/config';
import { Logger } from '@bot/services';
import axios, { HttpStatusCode } from 'axios';

import {
  ClientAccountLevel,
  ClientAvailabilityResponse,
  ClientFeedbackResponse,
  ClientMetadata,
  ClientMetadataResponse,
  ClientResponse,
} from './types';

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
      url: `${config.CHAT_GPT_API_HOST}/api/v1/clients`,
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
  if (Number.isNaN(telegramId)) {
    return null;
  }

  try {
    const clientAvailability = await fetchCachedData(
      `cached-client-availability-${telegramId}`,
      async () => {
        const response = await axios<ClientAvailabilityResponse>({
          method: 'get',
          url: `${config.CHAT_GPT_API_HOST}/api/v1/clients/availability/${telegramId}`,
        });

        return response.data;
      },
    );

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
      url: `${config.CHAT_GPT_API_HOST}/api/v1/clients/feedback`,
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

export const updateClientAccountLevel = async (telegramId: number) => {
  try {
    const response = await axios<ClientAccountLevel>({
      method: 'post',
      data: {
        telegramId,
      },
      url: `${config.CHAT_GPT_API_HOST}/api/v1/clients/accountLevel`,
    });

    return response.data;
  } catch (error) {
    Logger.error({
      context: 'src/api/clients/clients.api.ts::updateClientAccountLevel',
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
      url: `${config.CHAT_GPT_API_HOST}/api/v1/clients/metadata`,
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
