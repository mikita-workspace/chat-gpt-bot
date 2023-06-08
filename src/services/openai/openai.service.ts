import { config } from '@bot/config';
import {
  IMAGE_SIZE_DEFAULT,
  MAX_IMAGES_REQUEST,
  modelGPT,
  transcriptionModelGPT,
} from '@bot/constants';
import { logger } from '@bot/services';
import { removeFile } from '@bot/utils';
import { createReadStream } from 'fs';
import Jimp from 'jimp';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { resolve as resolvePath } from 'path';

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
        logger.error(`openAIService::chat::${JSON.stringify(error.message)}`);
      }
    }
  }

  async transcription(filepath: string) {
    try {
      const fileStream = createReadStream(filepath);

      const response = await this.openAI.createTranscription(
        fileStream as unknown as File,
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

  async convertGptImagesToFile(base64Images: string[]) {
    try {
      const imageFiles: string[] = [];

      const promises = base64Images.map(async (base64Image, index) => {
        const imagePath = resolvePath(__dirname, '../../../assets', `image-${index}.png`);
        const buffer = Buffer.from(base64Image, 'base64');

        const image = await Jimp.read(buffer);
        image.quality(5).write(imagePath);
        imageFiles.push(imagePath);
      });

      return await Promise.all(promises).then(() => imageFiles);
    } catch (error) {
      logger.error(`openAIService::convertGptImagesToFile::${JSON.stringify(error.message)}`);

      return [];
    }
  }
}

export const openAI = new OpenAIService(config.OPEN_AI_TOKEN, config.OPEN_AI_ORG);
