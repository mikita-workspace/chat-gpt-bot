import {
  MODEL_GPT_DEFAULT,
  MODEL_IMAGE_DEFAULT,
  MODEL_SPEECH_DEFAULT,
} from '@bot/api/gpt/constants';
import { SessionType } from '@bot/app/types';

export const resetSelectedModel = (): SessionType['client']['selectedModel'] => ({
  gpt: {
    model: MODEL_GPT_DEFAULT.model,
    title: MODEL_GPT_DEFAULT.title,
  },
  speech: {
    model: MODEL_SPEECH_DEFAULT.model,
    title: MODEL_SPEECH_DEFAULT.title,
  },
  image: {
    max: MODEL_IMAGE_DEFAULT.max,
    model: MODEL_IMAGE_DEFAULT.model,
    title: MODEL_IMAGE_DEFAULT.title,
  },
});

export const createInitialClientSession = (): SessionType['client'] => ({
  messages: [],
  metadata: {
    firstname: '',
    languageCode: '',
    lastname: '',
    username: '',
  },
  rate: null,
  selectedModel: resetSelectedModel(),
});

export const createInitialStoreSession = (): SessionType['store'] => ({ data: null });
