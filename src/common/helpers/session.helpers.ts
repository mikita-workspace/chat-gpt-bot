import { ModelGPT } from '@bot/api/gpt/constants';
import { SessionType } from '@bot/app/types';

export const createInitialClientSessionData = (): SessionType['client'] => ({
  messages: [],
  metadata: {
    firstname: null,
    lastname: null,
    username: null,
  },
  models: [],
  rate: null,
  selectedGptModel: ModelGPT.GPT_3_5_TURBO,
});
