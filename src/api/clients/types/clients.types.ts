export type ClientAvailabilityResponse = {
  models: string[];
  rate: { dalleImages: number; expiresAt: number; gptTokens: number };
  state: { blockReason: string; isApproved: string; isBlocked: string; updatedAt: number };
};

export type ClientResponse = {
  createdAt: number;
  telegramId: number;
  username: string;
};
