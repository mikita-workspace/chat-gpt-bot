import {
  MODEL_GPT_DEFAULT,
  MODEL_IMAGE_DEFAULT,
  MODEL_SPEECH_DEFAULT,
} from '@bot/api/gpt/constants';
import { SessionType } from '@bot/app/types';
import { getTimestampUnix } from '@bot/common/utils';

export const createInitialClientSessionData = (): SessionType['client'] => ({
  messages: [],
  lastMessageTimestamp: getTimestampUnix(),
  metadata: {
    firstname: '',
    lastname: '',
    username: '',
  },
  rate: null,
  selectedModel: {
    gpt: {
      model: MODEL_GPT_DEFAULT.model,
      title: MODEL_GPT_DEFAULT.title,
    },
    speech: {
      model: MODEL_SPEECH_DEFAULT.model,
      title: MODEL_SPEECH_DEFAULT.title,
    },
    image: {
      model: MODEL_IMAGE_DEFAULT.model,
      title: MODEL_IMAGE_DEFAULT.title,
    },
  },
});
