import { config } from '@bot/config';
import { modelGPT, transcriptionModelGPT } from '@bot/constants';
import { logger } from '@bot/services';
import { removeFile } from '@bot/utils';
import { createReadStream } from 'fs';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

class OpenAIService {
  openAI: OpenAIApi;

  constructor(apiKey: string, organization: string) {
    const configuration = new Configuration({
      apiKey,
      organization,
    });

    this.openAI = new OpenAIApi(configuration);
  }

  async chat(messages: ChatCompletionRequestMessage[]) {
    try {
      const response = await this.openAI.createChatCompletion({
        messages,
        model: modelGPT,
        top_p: 0.5,
      });

      return response.data.choices[0].message;
    } catch (error) {
      if (error.response) {
        logger.error(
          `openAIService::chat::[${error.response.status}]::${JSON.stringify(error.response.data)}`,
        );
      } else {
        logger.error(`openAIService::chat::${JSON.stringify(error)}`);
      }
    }
  }

  async transcription(filepath: string) {
    try {
      const fileStream: unknown = createReadStream(filepath);

      const response = await this.openAI.createTranscription(
        fileStream as File,
        transcriptionModelGPT,
      );

      removeFile(filepath);
      return response.data.text;
    } catch (error) {
      if (error.response) {
        logger.error(
          `openAIService::transcription::[${error.response.status}]::${JSON.stringify(
            error.response.data,
          )}`,
        );
      } else {
        logger.error(`openAIService::transcription::${JSON.stringify(error)}`);
      }
    }
  }
}

export const openAI = new OpenAIService(config.OPEN_AI_TOKEN, config.OPEN_AI_ORG);
