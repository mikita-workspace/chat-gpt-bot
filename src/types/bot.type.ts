import { MessageRolesGPT } from '@bot/constants';
import { ConversationFlavor } from '@grammyjs/conversations';
import { HydrateFlavor } from '@grammyjs/hydrate';
import { I18nFlavor } from '@grammyjs/i18n';
import { MenuFlavor } from '@grammyjs/menu';
import { Bot, Context, SessionFlavor } from 'grammy';

export type SessionType = {
  custom: {
    username: string | null;
    messages: {
      gptFormat: { content: string; role: `${MessageRolesGPT}` };
      timestamp: number;
    }[];
  };
};

export type SessionMessagesType = SessionType['custom']['messages'];

export type BotContextType = HydrateFlavor<
  Context & SessionFlavor<SessionType> & I18nFlavor & MenuFlavor & ConversationFlavor
>;

export type BotType = Bot<BotContextType>;
