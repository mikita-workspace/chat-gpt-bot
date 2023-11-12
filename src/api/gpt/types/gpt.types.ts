import { MessageRolesGPT, TypeGPT } from '@bot/api/gpt/constants';
import { ClientRate } from 'api/clients/types';

export type GptModelResponse = {
  model: string;
  title: string;
  description: string;
  creator: string;
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
