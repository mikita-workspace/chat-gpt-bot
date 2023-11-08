export type ClientStateResponse = {
  blockReason: string;
  isApproved: string;
  isBlocked: string;
  updatedAt: number;
};

export type ClientResponse = {
  createdAt: number;
  telegramId: number;
  username: string;
};
