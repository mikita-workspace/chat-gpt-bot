import { Bot, Context, SessionFlavor } from 'grammy';
import { I18nFlavor } from '@grammyjs/i18n';
import { MessageRoles } from '../constants';

export type SessionType = {
  messages: { content: string; role: `${MessageRoles}` }[];
};

export type BotContextType = Context & SessionFlavor<SessionType> & I18nFlavor;

export type BotType = Bot<BotContextType>;
