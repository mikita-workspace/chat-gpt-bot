// envs
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN ?? '';
const OPEN_AI_TOKEN = process.env.OPEN_AI_TOKEN ?? '';

// Open AI
const gptModel = 'gpt-3.5-turbo';
const transcriptionModel = 'whisper-1';
enum MessageRoles {
  ASSISTANT = 'assistant',
  USER = 'user',
  SYSTEM = 'system',
}

// Telegraph
const INITIAL_SESSION = {
  messages: [],
};

export {
  INITIAL_SESSION,
  MessageRoles,
  OPEN_AI_TOKEN,
  TELEGRAM_TOKEN,
  gptModel,
  transcriptionModel,
};
