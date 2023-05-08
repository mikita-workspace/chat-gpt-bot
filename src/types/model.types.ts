import { UserRoles } from '../constants';
import { SessionType } from '.';

export type UserModelType = {
  timestamp: number;
  enabled: boolean;
  role: UserRoles;
  username: string;
};

export type SessionModelType = {
  key: string;
  value: {
    username: string;
    messages: SessionType['messages'];
  };
};
