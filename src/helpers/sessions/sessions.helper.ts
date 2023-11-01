import { ModelGPT, SessionCsvIds } from '@bot/constants';
import { SessionType, UserSessionModelType } from '@bot/types';

export const createInitialUserSessionData = (): SessionType['user'] => ({
  messages: [],
  username: null,
});

export const createInitialSettingsSessionData = (): SessionType['settings'] => ({
  amountOfGptImages: 0,
  amountOfGptTokens: 0,
  selectedGPTModel: ModelGPT.GPT_3_5_TURBO,
});

export const createInitialMemorySessionData = (): SessionType['memory'] => ({
  userData: {
    selectedUsername: null,
  },
});

export const mapUserMessages = (userSession: UserSessionModelType) =>
  userSession.value.messages.map(({ timestamp, gptFormat: { content, role } }) => ({
    [SessionCsvIds.KEY]: userSession.key,
    [SessionCsvIds.USERNAME]: userSession.value.username,
    [SessionCsvIds.ROLE]: role,
    [SessionCsvIds.TIMESTAMP]: timestamp,
    [SessionCsvIds.CONTENT]: content,
  }));
