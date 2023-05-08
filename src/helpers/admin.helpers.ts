import { parseTimestamp } from '../utils';
import { MessageRoles } from '../constants';
import { BotContextType, SessionType, UserModelType } from '../types';

export const getHtmlForSessionMessages = (
  ctx: BotContextType,
  messages: SessionType['messages'],
) => {
  if (messages.length > 0) {
    return messages
      .map((message) => {
        const {
          gptFormat: { role, content },
          timestamp,
        } = message;

        if (role === MessageRoles.USER) {
          return `<code>[${parseTimestamp(timestamp)}]</code>\n\r<b>${content}</b>\n\r`;
        }

        return `${content}\n\r\n\r`;
      })
      .join('');
  }

  return ctx.t('error-common');
};

export const getHtmlForUsers = (ctx: BotContextType, users: UserModelType[]) => {
  if (users.length > 0) {
    return users
      .map((user) => {
        const { createTimestamp, enabled, role, username } = user;

        return `<b>${username}</b>\n\r${ctx.t('admin-get-all-users-role')} ${role}\n\r${ctx.t(
          'admin-get-all-users-active',
        )} ${!enabled}\n\r<code>${parseTimestamp(createTimestamp)}</code>\n\r\n\r`;
      })
      .join('');
  }

  return ctx.t('error-common');
};
