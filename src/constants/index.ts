// Open AI
export const gptModel = 'gpt-3.5-turbo';
export const transcriptionModel = 'whisper-1';
export enum MessageRoles {
  ASSISTANT = 'assistant',
  USER = 'user',
  SYSTEM = 'system',
}

// Telegram API
export const telegramApi = 'https://api.telegram.org';

// Node cache
export const TTL_DEFAULT = 60;

// Privileges
export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export const ADD_USER_FORMAT = '#<username>;#<role>;';

// Regexp
export const REGEXP_ADD_USER_INPUT = /^#[a-zA-Z0-9_]+;#[a-z]+;$/;

// Normalize
export const MAX_SESSION_MESSAGES = 30;

// CSV files
export enum SessionCsvIds {
  CONTENT = 'content',
  KEY = 'key',
  ROLE = 'role',
  TIMESTAMP = 'timestamp',
  USERNAME = 'username',
}

export enum UsersCsvIds {
  ENABLED = 'enabled',
  ROLE = 'role',
  TIMESTAMP = 'timestamp',
  USERNAME = 'username',
}
