import { ChatCompletionResponse } from '@bot/api/gpt/types';

export type ClientAvailabilityResponse = {
  models: string[];
  rate: { images: number; expiresAt: number; gptTokens: number; name: string };
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
