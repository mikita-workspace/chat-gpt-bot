import { MessageRolesGPT } from '@bot/api/gpt/constants';

export type GptModelsResponse = {
  model: string;
  title: string;
  description: string;
  creator: string;
  input: string[];
};

export type ChatCompletionResponse = {
  clientRate: { dalleImages: number; expiresAt: number; gptTokens: number };
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
