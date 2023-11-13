import { MessageRolesGPT, TypeGPT } from '@bot/api/gpt/constants';
import { ClientRate } from 'api/clients/types';

export type GptModelResponse = {
  creator: string;
  description: string;
  max?: number;
  model: string;
  title: string;
  type: `${TypeGPT}`;
};

export type ChatCompletionResponse = {
  clientRate: ClientRate;
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

export type GenerateImagesResponse = {
  clientRate: ClientRate;
  images: {
    bytes: number | null;
    height: number;
    url: string;
    width: number;
  }[];
  revisedPrompt: string[];
};
