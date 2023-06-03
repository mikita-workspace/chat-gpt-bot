import { UserRoles } from '@bot/constants';
import { SessionMessageType } from '@bot/types';

export type UserModelType = {
  conversation: object;
  enabled: boolean;
  limit: {
    gptTokens: number;
    gptImages: number;
    expire: string;
  };
  role: UserRoles;
  timestamp: string;
  username: string;
};

export type SessionModelType = {
  key: string;
  value: {
    username: string;
    messages: SessionMessageType[];
  };
};

export type BotLoggerModelType = {
  level: string;
  message: string;
  meta: { username: string };
  timestamp: Date;
};

export type UserConversationModelType = {
  messages: SessionMessageType[];
  username: string;
};
