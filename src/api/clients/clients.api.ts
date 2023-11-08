import { ClientResponse, ClientStateResponse } from '@bot/api/clients/types';
import { config } from '@bot/config';
import { BotLanguageCodes } from '@bot/constants';
import { logger } from '@bot/services';
import { fetchCachedData } from '@bot/utils';
import axios, { HttpStatusCode } from 'axios';

export const createClient = async (
  telegramId: number,
  username = '',
  languageCode = BotLanguageCodes.ENGLISH,
): Promise<ClientResponse | null> => {
  try {
    const response = await axios<ClientResponse>({
      method: 'post',
      data: { languageCode, telegramId, username },
      url: `${config.CHAT_GPT_API_HOST}/v1/api/clients`,
    });

    return response.data;
  } catch (error) {
    logger.error(`src/api/clients/clients.api.ts::createClient::${JSON.stringify(error.message)}`);

    return null;
  }
};

export const getClientAvailability = async (
  telegramId: number,
): Promise<ClientStateResponse | null> => {
  try {
    const clientState = await fetchCachedData('cached-client-availability', async () => {
      const response = await axios<ClientStateResponse>({
        method: 'get',
        url: `${config.CHAT_GPT_API_HOST}/v1/api/clients/availability/${telegramId}`,
      });

      return response.data;
    });

    return clientState;
  } catch (error) {
    if (error.response && error.response.status !== HttpStatusCode.NotFound) {
      logger.error(
        `src/api/clients/clients.api.ts::getClientAvailability::${JSON.stringify(error.message)}`,
      );
    }

    return null;
  }
};
