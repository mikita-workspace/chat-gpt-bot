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
    messages: SessionType['messages'];
  };
};
