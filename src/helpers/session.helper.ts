import { SessionType } from '../types';

export const createInitialSessionData = (): SessionType => ({
  username: null,
  messages: [],
});
