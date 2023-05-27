import { SessionCsvIds } from '@bot/constants';
import { SessionModelType, SessionType } from '@bot/types';

export const createInitialCustomSessionData = (): SessionType['custom'] => ({
  messages: [],
  username: null,
});

export const mapUserSessionMessages = (userSession: SessionModelType) =>
  userSession.value.messages.map(({ timestamp, gptFormat: { content, role } }) => ({
    [SessionCsvIds.KEY]: userSession.key,
    [SessionCsvIds.USERNAME]: userSession.value.username,
    [SessionCsvIds.ROLE]: role,
    [SessionCsvIds.TIMESTAMP]: timestamp,
    [SessionCsvIds.CONTENT]: content,
  }));
