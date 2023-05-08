import { SessionType, SessionModelType } from '@bot/types';
import { SessionCsvIds } from '@bot/constants';

export const createInitialSessionData = (): SessionType => ({
  username: null,
  messages: [],
});

export const mapUserSessionMessages = (userSession: SessionModelType) =>
  userSession.value.messages.map(({ timestamp, gptFormat: { content, role } }) => ({
    [SessionCsvIds.KEY]: userSession.key,
    [SessionCsvIds.USERNAME]: userSession.value.username,
    [SessionCsvIds.ROLE]: role,
    [SessionCsvIds.TIMESTAMP]: timestamp,
    [SessionCsvIds.CONTENT]: content,
  }));
