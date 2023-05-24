import { UserRoles } from '@bot/constants';
import { SessionMessagesType } from '@bot/types';

export type UserModelType = {
  conversation: object;
  enabled: boolean;
  role: `${UserRoles}`;
  timestamp: string;
  username: string;
};

export type SessionModelType = {
  key: string;
  value: {
    username: string;
    messages: SessionMessagesType;
  };
};

export type LoggerModelType = {
  timestamp: string;
  level: string;
  message: string;
};

export type UserConversationModelType = {
  messages: SessionMessagesType;
  username: string;
};
