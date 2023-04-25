// envs
export const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN ?? '';
export const OPEN_AI_TOKEN = process.env.OPEN_AI_TOKEN ?? '';

// Error messages
export const commonErrorMessage = 'Something went wrong. Try again!';

// Open AI
export const gptModel = 'gpt-3.5-turbo';
export const transcriptionModel = 'whisper-1';
export enum MessageRoles {
  ASSISTANT = 'assistant',
  USER = 'user',
  SYSTEM = 'system',
}

// Telegraph
export const INITIAL_SESSION = {
  messages: [],
};
