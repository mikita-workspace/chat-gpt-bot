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

// Bot
export const supportLanguageCodes = ['en', 'ru'];

export enum BotCommands {
  ABOUT = 'about',
  ADMIN = 'admin',
  DESCRIPTION = 'description',
  NEW = 'new',
  START = 'start',
}

export const BotCommandsWithDescription = [
  { command: BotCommands.ADMIN, i18nKey: 'bot-command-admin' },
  { command: BotCommands.DESCRIPTION, i18nKey: 'bot-command-description' },
  { command: BotCommands.ABOUT, i18nKey: 'bot-command-about' },
];

// Node cache
export const TTL_DEFAULT = 60;

// Privileges
export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export const ADD_USER_FORMAT = '<username>;<admin | user | moderator>';

// Regexp
export const REGEXP_USERNAME = /^[a-z0-9_-]{3,16}$/;

// Normalize
export const MAX_SESSION_MESSAGES = 30;

// CSV files
export const CSV_READER_URL = 'https://www.convertcsv.com/csv-viewer-editor.htm';

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
