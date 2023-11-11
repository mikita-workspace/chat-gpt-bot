import { ModelGPT } from '@bot/api/gpt/constants';
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
  models: [],
  rate: null,
  selectedGpt: {
    model: ModelGPT.GPT_3_5_TURBO,
    title: ModelGPT.GPT_3_5_TURBO,
  },
});
