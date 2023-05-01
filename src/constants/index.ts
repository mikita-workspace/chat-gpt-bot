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
