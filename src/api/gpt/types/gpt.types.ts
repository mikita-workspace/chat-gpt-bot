import { MessageRolesGPT, TypeGPT } from '@bot/api/gpt/constants';

export type GptModelResponse = {
  model: string;
  title: string;
  description: string;
  creator: string;
  type: `${TypeGPT}`;
};

export type ChatCompletionResponse = {
  clientRate: { dalleImages: number; expiresAt: number; gptTokens: number; name: string };
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
