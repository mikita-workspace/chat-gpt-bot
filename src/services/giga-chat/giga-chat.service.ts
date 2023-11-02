import { config } from '@bot/config';
import { APIs, ModelGPT } from '@bot/constants';
import { logger, mongo } from '@bot/services';
import { isExpiredDate } from '@bot/utils';
import axios from 'axios';
import https from 'https';
import { ChatCompletionRequestMessage } from 'openai';
import qs from 'querystring';

class GigaChatService {
  private async getAccessToken() {
    try {
      const secrets = await mongo.getSecrets();

      if (secrets && !isExpiredDate(secrets?.gigaChatAccessToken?.expires_at as number)) {
        return (secrets?.gigaChatAccessToken?.access_token as string) ?? '';
      }

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        RqUID: '6f0b1291-c7f3-43c6-bb2e-9f3efb2dc98e',
        Authorization: `Bearer ${config.GIGA_CHAT_AUTH_TOKEN}`,
      };

      const response = await axios({
        method: 'post',
        headers,
        data: qs.stringify({ scope: 'GIGACHAT_API_PERS' }),
        // NOTE: TLS certificate is disabled
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
        url: APIs.GIGA_CHAT_OAUTH,
      });

      const data = response.data;

      await mongo.setSecrets({ gigaChatAccessToken: data });

      logger.info('GigaChatService::getAccessToken::Access token received');

      return data.access_token as string;
    } catch (error) {
      logger.error(`GigaChatService::initialize::${JSON.stringify(error.message)}`);

      return '';
    }
  }

  async chat(messages: ChatCompletionRequestMessage[] = []) {
    try {
      const accessToken = await this.getAccessToken();

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'X-Request-ID': '79e41a5f-f180-4c7a-b2d9-393086ae20a1',
        'X-Session-ID': 'b6874da0-bf06-410b-a150-fd5f9164a0b2',
        'X-Client-ID': 'b6874da0-bf06-410b-a150-fd5f9164a0b2',
      };

      const data = {
        max_tokens: 512,
        messages,
        model: ModelGPT.GIGA_CHAT,
        n: 1,
        repetition_penalty: 1.07,
        stream: false,
        temperature: 0.87,
        top_p: 0.47,
        update_interval: 0,
      };

      const response = await axios({
        method: 'post',
        headers,
        // NOTE: TLS certificate is disabled
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
        data,
        url: `${APIs.GIGA_CHAT}/chat/completions`,
      });

      return { message: response.data.choices[0].message, usage: response.data.usage };
    } catch (error) {
      if (error.response) {
        logger.error(
          `GigaChatService::chat::[${error.response.status}]::${JSON.stringify(
            error.response.data,
          )}`,
        );
      } else {
        logger.error(`GigaChatService::chat::${JSON.stringify(error.message)}`);
      }
    }
  }
}

export const gigaChat = new GigaChatService();
