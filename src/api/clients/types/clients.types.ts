import { ChatCompletionResponse } from '@bot/api/gpt/types';

export type ClientRate = { images: number; expiresAt: number; gptTokens: number; name: string };

export type ClientAvailabilityResponse = {
  models: string[];
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
