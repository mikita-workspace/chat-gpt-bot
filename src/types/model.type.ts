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
  level: string;
  message: string;
  meta: { username: string };
  timestamp: string;
};

export type UserConversationModelType = {
  messages: SessionMessagesType;
  username: string;
};
