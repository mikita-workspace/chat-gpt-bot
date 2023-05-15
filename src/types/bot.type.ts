import { MessageRoles } from '@bot/constants';
import { ConversationFlavor } from '@grammyjs/conversations';
import { I18nFlavor } from '@grammyjs/i18n';
import { MenuFlavor } from '@grammyjs/menu';
import { Bot, Context, SessionFlavor } from 'grammy';

export type SessionType = {
  custom: {
    username: string | null;
    messages: {
      gptFormat: { content: string; role: `${MessageRoles}` };
      timestamp: number;
    }[];
  };
};

export type BotContextType = Context &
  SessionFlavor<SessionType> &
  I18nFlavor &
  MenuFlavor &
  ConversationFlavor;

export type BotType = Bot<BotContextType>;
