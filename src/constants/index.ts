// envs
export const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN ?? '';
export const OPEN_AI_TOKEN = process.env.OPEN_AI_TOKEN ?? '';
export const MONGODB_URI = process.env.MONGODB_URI ?? '';

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
