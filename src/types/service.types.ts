import { ChatCompletionRequestMessage, OpenAIApi } from 'openai';

export interface IOggConverter {
  toMp3(input: string, output: string): void;
  create(url: string, filename: string): void;
}

export interface IOpenAI {
  openAI: OpenAIApi;
  chat(messages: ChatCompletionRequestMessage[]): void;
  transcription(filepath: string): void;
}

export interface IMongoDB {
  createOrGetUser(from: any): any;
}
