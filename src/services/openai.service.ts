import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { createReadStream } from 'fs';
import { removeFile } from '../utils';
import { IOpenAI } from '../types';
import { OPEN_AI_TOKEN, gptModel, transcriptionModel } from '../constants';

class OpenAIService implements IOpenAI {
  openAI: OpenAIApi;

  constructor(apiKey: string) {
    const configuration = new Configuration({
      apiKey,
    });

    this.openAI = new OpenAIApi(configuration);
  }

  async chat(messages: ChatCompletionRequestMessage[]) {
    try {
      const response = await this.openAI.createChatCompletion({
        model: gptModel,
        messages,
      });

      return response.data.choices[0].message;
    } catch (error) {
      console.error(`ERROR::OpenAI::chat::${(error as Error).message}`);
    }
  }

  async transcription(filepath: string) {
    try {
      const fileStream: unknown = createReadStream(filepath);

      const response = await this.openAI.createTranscription(
        fileStream as File,
        transcriptionModel,
      );

      removeFile(filepath);
      return response.data.text;
    } catch (error) {
      console.error(
        `ERROR::OpenAI::transcription::${(error as Error).message}`,
      );
    }
  }
}

export const openAI = new OpenAIService(OPEN_AI_TOKEN);
