import { parseTimestamp } from '../utils';
import { MessageRoles } from '../constants';
import { SessionType } from '../types';

export const createInitialSessionData = (): SessionType => ({
  messages: [],
});

export const getHtmlForSessionMessages = (
  messages: SessionType['messages'] = [],
  errorMessage = '',
) => {
  if (messages.length > 0) {
    return messages
      .map((message) => {
        const {
          gptFormat: { role, content },
          timestamp,
        } = message;

        if (role === MessageRoles.USER) {
          return `<code>[${parseTimestamp(
            timestamp,
          )}]</code>\n\r<b>- ${content}</b>\n\r\n\r`;
        }

        return `${content}\n\r\n\r`;
      })
      .join('');
  }

  return errorMessage;
};
