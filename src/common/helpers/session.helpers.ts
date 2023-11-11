import { ModelGPT } from '@bot/api/gpt/constants';
import { SessionType } from '@bot/app/types';

export const createInitialClientSessionData = (): SessionType['client'] => ({
  messages: [],
  models: [],
  rate: null,
  selectedGptModel: ModelGPT.GPT_3_5_TURBO,
  username: null,
});
