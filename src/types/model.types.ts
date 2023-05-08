import { UserRoles } from '../constants';
import { SessionType } from '.';

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
