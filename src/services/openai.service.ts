import { config } from '@bot/config';
import { gptModel, transcriptionModel } from '@bot/constants';
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
        model: gptModel,
        top_p: 0.5,
      });

      return response.data.choices[0].message;
    } catch (error) {
      logger.error(`openAIService::chat::${(error as Error).message}`);
    }
  }

  async transcription(filepath = '') {
    try {
      const fileStream: unknown = createReadStream(filepath);

      const response = await this.openAI.createTranscription(
        fileStream as File,
        transcriptionModel,
      );

      removeFile(filepath);
      return response.data.text;
    } catch (error) {
      logger.error(`openAIService::transcription::${(error as Error).message}`);
    }
  }
}

export const openAI = new OpenAIService(config.OPEN_AI_TOKEN, config.OPEN_AI_ORG);
