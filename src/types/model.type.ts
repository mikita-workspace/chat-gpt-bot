import { UserRoles } from '@bot/constants';
import { SessionType } from '@bot/types';

export type UserModelType = {
  enabled: boolean;
  role: UserRoles;
  timestamp: number;
  username: string;
};

export type SessionModelType = {
  key: string;
  value: {
    username: string;
    messages: SessionType['custom']['messages'];
  };
};

export type LoggerModelType = {
  timestamp: string;
  level: string;
  message: string;
};

export type UserConversationModelType = {
  messages: SessionType['custom']['messages'];
  username: string;
};
