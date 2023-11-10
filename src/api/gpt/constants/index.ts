export enum ModelGPT {
  GIGA_CHAT = 'GigaChat:latest',
  GPT_3_5_TURBO = 'gpt-3.5-turbo-1106',
  WHISPER_1 = 'whisper-1',
}

export enum MessageRolesGPT {
  ASSISTANT = 'assistant',
  USER = 'user',
  SYSTEM = 'system',
}

export const MAX_CONTEXT_TOKENS = 4096;
export const IMAGE_SIZE_DEFAULT = '256x256';
export const MAX_IMAGES_REQUEST = 3;
