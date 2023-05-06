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

// Callback query actions
export enum CallbackQueryActions {
  USERS = 'users-action',
  ADD_USER = 'add-user-action',
  BLOCK_USER = 'block-user-action',
  UNBLOCK_USER = 'unblock-user-action',
  GET_ALL_USERS = 'get-all-users-action',
  SESSIONS = 'sessions-action',
  DELETE_SESSION = 'delete-session-action',
  GET_SESSION = 'get-session-action',
  GO_BACK = 'go-back-action',
}
