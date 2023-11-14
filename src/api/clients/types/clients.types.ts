import { ChatCompletionResponse } from '@bot/api/gpt/types';

export type ClientRate = {
  expiresAt: number;
  gptModels: string[];
  gptTokens: number;
  images: number;
  name: string;
  symbol: string;
};

export type ClientAvailabilityResponse = {
  rate: ClientRate;
  state: { blockReason: string; isApproved: string; isBlocked: string; updatedAt: number };
};

export type ClientResponse = {
  createdAt: number;
  telegramId: number;
  username: string;
};

export type ClientFeedbackResponse = {
  createdAt: number;
  feedback: string;
  messageId: number;
  messages: ChatCompletionResponse['message'][];
  updatedAt: number;
};
