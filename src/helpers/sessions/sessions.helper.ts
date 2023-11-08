import { ModelGPT, SessionCsvIds } from '@bot/constants';
import { SessionType, UserSessionModelType } from '@bot/types';

export const createInitialClientSessionData = (): SessionType['client'] => ({
  messages: [],
  username: null,
  rate: {
    dalleImages: 0,
    gptTokens: 0,
  },
  selectedGptModel: ModelGPT.GPT_3_5_TURBO,
});

export const mapUserMessages = (userSession: UserSessionModelType) =>
  userSession.value.messages.map(({ timestamp, gptFormat: { content, role } }) => ({
    [SessionCsvIds.KEY]: userSession.key,
    [SessionCsvIds.USERNAME]: userSession.value.username,
    [SessionCsvIds.ROLE]: role,
    [SessionCsvIds.TIMESTAMP]: timestamp,
    [SessionCsvIds.CONTENT]: content,
  }));
