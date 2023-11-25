import { ChatCompletionResponse } from '@bot/api/gpt/types';

export type ClientAccountLevel = {
  expiresAt: Date;
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
  state: { blockReason: string; isApproved: string; isBlocked: string; updatedAt: Date };
};

export type ClientResponse = {
  createdAt: Date;
  telegramId: number;
  username: string;
};

export type ClientFeedbackResponse = {
  createdAt: Date;
  feedback: string;
  messageId: number;
  messages: ChatCompletionResponse['message'][];
  updatedAt: Date;
};

export type ClientMetadataResponse = ClientMetadata;
