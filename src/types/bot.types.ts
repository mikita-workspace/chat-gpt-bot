import { Bot, Context, SessionFlavor } from 'grammy';
import { I18nFlavor } from '@grammyjs/i18n';
import { MessageRoles } from '../constants';

export type SessionType = {
  messages: {
    gptFormat: { content: string; role: `${MessageRoles}` };
    timestamp: number;
  }[];
};

export type BotContextType = Context & SessionFlavor<SessionType> & I18nFlavor;

export type BotType = Bot<BotContextType>;
