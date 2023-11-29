import { MessageRolesGPT, TypeGPT } from '@bot/api/gpt/constants';
import { ClientAccountLevel } from 'api/clients/types';

export type GptModelResponse = {
  associated: string[];
  creator: string;
  description: string;
  max?: number;
  model: string;
  title: string;
  type: `${TypeGPT}`;
};

export type ChatCompletionResponse = {
  clientAccountLevel: ClientAccountLevel;
  message: {
    content: string;
    role: `${MessageRolesGPT}`;
  };
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
};

export type VisionCompletionResponse = ChatCompletionResponse;

export type TranscriptionResponse = { text: string };

export type GenerateImagesResponse = {
  clientAccountLevel: ClientAccountLevel;
  images: {
    bytes: number | null;
    height: number;
    url: string;
    width: number;
  }[];
  revisedPrompt: string[];
};
