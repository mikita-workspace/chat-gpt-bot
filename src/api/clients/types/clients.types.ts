import { ChatCompletionResponse } from '@bot/api/gpt/types';

export type ClientAccountLevel = {
  expiresAt: number;
  gptModels: string[];
  gptTokens: number;
  images: number;
  name: string;
  symbol: string;
};

export type ClientMetadata = {
  firstname: string;
  languageCode: string;
  lastname?: string;
  username?: string;
};

export type ClientAvailabilityResponse = {
  accountLevel: ClientAccountLevel;
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

export type ClientMetadataResponse = ClientMetadata;
