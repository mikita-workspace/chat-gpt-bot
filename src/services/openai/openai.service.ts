import { config } from '@bot/config';
import {
  IMAGE_SIZE_DEFAULT,
  MAX_IMAGES_REQUEST,
  modelGPT,
  transcriptionModelGPT,
} from '@bot/constants';
import { logger } from '@bot/services';
import { removeFile } from '@bot/utils';
import axios from 'axios';
import { createReadStream, createWriteStream, writeFileSync } from 'fs';
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

  async convertGptImages(base24Images: string[]) {
    try {
      const imagePath = resolvePath(__dirname, '../../../assets', `image-1.png`);

      const buffer = Buffer.from(base24Images[0], 'base64');

      writeFileSync(imagePath, buffer);
    } catch (error) {
      logger.error(`csvService::downloadGptImages::${JSON.stringify(error.message)}`);

      return '';
    }
  }
}

export const openAI = new OpenAIService(config.OPEN_AI_TOKEN, config.OPEN_AI_ORG);

// const Jimp = require("jimp");
// const fs = require("fs");
// // Base64 string
// const data =
//   "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAP////////////////////////////////////////////////////////////////////////////////////8B///////////////////////////////////////////////////////////////////////////////////////AABEIAMgBLAMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/ACqJCgAoAKACgAoAWgAoAKBBQAUAFABQAUAFABQAmaAEoGFABQAUgFoAWgQUAFABQAUAJQAUAFABQMKACgAoASgAoAKACgBaYBQAUAFABQAUALQAUAFAgoAKACgAoAKAEoGJQAUAJQAtAC0AFIBaBBQAUAFABQAUAJQAlAwoAKAFoAKAEoAKACgAoAKAFpgFABQAUAFAC0AFAgoAKACgAoAKACgBCaAE/wA/WgYlAwoAKBC0gFoAWgQUAFABQAlAwoAKAEoAKACgAoAKACgAoAKACgAoAKAFpgFABQAUALQAUAFAgoAKACgAoAKAEoASgYlAxKAFoAKBDqQC0CCgAoASgAoAKBhQAUAJQAUAJQAUDCgAoEFABQAUALQAUALTAKACgAoAWgAoAKBBQAUAFABQA2gYUDEoAKAEoAWkIWgBaBC0AJQAUDCmFhM0BYKACgAoAKACgBKACgYUAFIAoAKACgBaAEoAdTEFABQAUALQAUAFAgoAKACgBDQMbQMKACgBKAFoAWkIWgAoEFACUxiUAFABQAUAFAC0AFABQAlABQMKACkAUAFABQAUAFADqYgoAKAFoAKBBQAUAFABQAhoGNoGFABQAUAFAC0CFpALQISmAlAwoAKAEoGFABQAUAFABmgAoAKACgAoAKACgAoAKACkAtAC0xBQAUALQAUCCgAoAKACgBDQMbQMKAEoAWgAoAWgQtIAoEJTGFACUDCgAoAMUALigVwxQFxMUDCgBKACgAoAKAFoAKAEoAKAFpAFADqYgoAKAFoAKBBQAUAFABQAhoGNoGFABSAWgAoEFABTGFAhKBhQAUCHYoC4tIQUAFACUAFAxKAEpgJQMKACgAoAKACgYUhC0CFoAWmAUAFAC0AFAgoAKACgAoASgYlABQAUgFoAKACgBOtMBKACgYUAAoELmgLBmgAoASgAoAKBhQAUAJQAUAFABQAUAFAxaQhaBBQAtMAoAKAFoAKBBQAUAFABQAUAJSGJQAUALQAUCCgBD60xiUDCgAoAKACgAoAKACgAoAKBBQAUDCgBKACgAoGFABQIWkAtAgoAWmAUAFAC0AFAgoAKACgAoAKACkAlABQMKACgQUDDrTATFACUDCgBaBBQAUAGKACgAoAKACgAoAKAEoGFACUALQAUALSEFABQAtMAoAKAFoAKBBQAUAFABQAUAFIBKBhQAUAJTAKACgAoAKACgAoAKAFxQIOlADaBjhQDCkIKACmAUDEoAKAEoGFAC0hC0AFACUALTAKAFoAKACgQUAFABQAUAFABSASgYUAFABTASgAoAKACgAoAKACgB1AhtAxKBjhQSxaQgoGJTAKBiUAFABQAUAFIBaACgAoAKYBQAUAFAC0CCgAoAKACgAoAKQBQAlACUDFoASgBKYBQAtABQAUAAoAdSJExQUJimFxwoEFIQUAFMYlAxKACgANAAKACkAtABQIKACmMKACgBaACgQUAFABQAUAFABSAKAEoAKBhQAUAJTAKACgAoAKACgB1IkKACgBaAEoAKACmMSgYlABQAGgAoAWkAUAFAgoAKYwoAKAFoAKBBQAUAFABQAUAFIAoASgdwxQFxKACgApgFABQAtACUAAoBjqQgoELQAUAJTASgYlAwoAKACgBKQxaBC0CCgAoAKACmMKACgBaACgQUAFABQAUAFABSAKACgBKACgYUAJTAKAFoAKAEoBCUAPpCCgQtACUAFMYlAxKACgAoAKACkAtAgoAWgAoASgApjCgAoAKAFoEFABQAUAFABQAUgCgBKACgBaAEoGFACUALTEFACUDCgBaBC5oAKAEoAKACgBKBhQAUgCgBaBBQAUALQAUAFACUxhQAUALQAUCCgAoAKACgAoAKQBQAUAFABQAlAwoAKACmAUCDFABQAUAFABQAUAJQMKACgAoAKQC0AFAgoAWgAoAKACgBKYwoAKACgBaACgAoEFABQAUAFABQAtIBKAEoAWgAoAKAEpgGKAFpAFABTEJQMKBiUAFIBaAEoAKACgBaAFoEFABQAUAFABQAlMYUAFABQAtABQAUCCgAoAKACgAoAKQBQAlAC0AFABQAUwCgApAGKAEphYM0DsHNACUALSAKACgAoAKBC0AFABQAUAFABQAUAJTGFABQAUALQAUAFAgoAKACgAoAKACkAUAFABQAUAFABQAUAFABQAUAJQAUAFABQAtACUDCgQtABQAUAFABQAUAFMAoASgYUAFABQAUALQAUCCgAoAKACgAoAKQBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFACUDFoEFABQAUAFABQAUAFMAoASgYUAFABQAUALQAUAFABQIKACgAoAKQBQAUAFABQAUAFABQAUAFAC0CCgAoAKACgBKBhQAUAFABQAUAFABTAKACgAoA/wD/2Q==";
// // Convert base64 to buffer => <Buffer ff d8 ff db 00 43 00 ...
// const buffer = Buffer.from(data, "base64");
// Jimp.read(buffer, (err, res) => {
//   if (err) throw new Error(err);
//   res.quality(5).write("resized.jpg");
// });
