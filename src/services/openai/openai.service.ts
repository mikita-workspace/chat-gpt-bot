import { config } from '@bot/config';
import { IMAGE_SIZE_DEFAULT, MAX_IMAGES_REQUEST, ModelGPT } from '@bot/constants';
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
        model: ModelGPT.GPT_3_5_TURBO,
        top_p: 0.5,
      });

      return response.data.choices[0].message;
    } catch (error) {
      if (error.response) {
        logger.error(
          `openAIService::chat::[${error.response.status}]::${JSON.stringify(error.response.data)}`,
        );
      } else {
        logger.error(`openAIService::chat::${JSON.stringify(error.message)}`);
      }
    }
  }

  async transcription(filepath: string) {
    try {
      const fileStream = createReadStream(filepath);

      const response = await this.openAI.createTranscription(
        fileStream as unknown as File,
        ModelGPT.WHISPER_1,
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
        logger.error(`openAIService::transcription::${JSON.stringify(error.message)}`);
      }
    }
  }

  async generateImage(prompt: string, numberOfImages: number) {
    try {
      const response = await this.openAI.createImage({
        n: Math.min(MAX_IMAGES_REQUEST, numberOfImages <= 0 ? 1 : numberOfImages),
        prompt,
        response_format: 'b64_json',
        size: IMAGE_SIZE_DEFAULT,
      });

      return response.data.data;
    } catch (error) {
      if (error.response) {
        logger.error(
          `openAIService::generateImage::[${error.response.status}]::${JSON.stringify(
            error.response.data,
          )}`,
        );
      } else {
        logger.error(`openAIService::generateImage::${JSON.stringify(error.message)}`);
      }

      return [];
    }
  }
}

export const openAI = new OpenAIService(config.OPEN_AI_TOKEN, config.OPEN_AI_ORG);
