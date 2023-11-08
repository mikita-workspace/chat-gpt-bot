import { UserRoles } from '@bot/constants';
import { SessionMessageType } from '@bot/types';
import { Schema } from 'mongoose';

export type UserModelType = {
  availableGPTModels: string[];
  conversation: Schema.Types.ObjectId;
  enabled: boolean;
  limit: {
    gptTokens: number;
    gptImages: number;
    expire: string;
  };
  role: UserRoles;
  timestamp: number;
  username: string;
};

export type MultipleUserType = { username: string; role: UserRoles };

export type UserSessionModelType = {
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
  _id: Schema.Types.ObjectId;
  messages: SessionMessageType[];
  username: string;
};

export type UserImageModelType = {
  images: {
    prompt: string;
    imageLinks: string[];
  }[];
  folderId: string;
  username: string;
};

export type SecretsModelType = {
  gigaChatAccessToken: string;
  googleRefreshToken: string;
};

export type SecretsType = {
  gigaChatAccessToken?: { [key: string]: string | number };
  googleRefreshToken?: string;
};
