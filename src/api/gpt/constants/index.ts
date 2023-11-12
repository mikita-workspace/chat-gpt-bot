export const MODEL_GPT_DEFAULT = 'gpt-3.5-turbo-1106';
export const MODEL_SPEECH_DEFAULT = 'whisper-1';
export const MODEL_IMAGE_DEFAULT = 'dall-e-3';

export const TITLE_SPEECH_NONE = 'None';

export enum TypeGPT {
  TEXT = 'text',
  SPEECH = 'speech',
}

export enum MessageRolesGPT {
  ASSISTANT = 'assistant',
  USER = 'user',
  SYSTEM = 'system',
}

export const MAX_CONTEXT_TOKENS = 4096;
export const IMAGE_SIZE_DEFAULT = '256x256';
export const MAX_IMAGES_REQUEST = 3;
