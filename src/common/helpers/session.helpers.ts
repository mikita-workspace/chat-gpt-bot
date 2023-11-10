import { ModelGPT } from '@bot/api/gpt/constants';
import { SessionType } from '@bot/types';

export const createInitialClientSessionData = (): SessionType['client'] => ({
  messages: [],
  selectedGptModel: ModelGPT.GPT_3_5_TURBO,
  username: null,
});
