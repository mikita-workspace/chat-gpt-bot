import { MessageRolesGPT } from '@bot/constants';
import { ConversationFlavor } from '@grammyjs/conversations';
import { HydrateFlavor } from '@grammyjs/hydrate';
import { I18nFlavor } from '@grammyjs/i18n';
import { MenuFlavor } from '@grammyjs/menu';
import { Bot, Context, SessionFlavor } from 'grammy';

export type SessionMessageType = {
  gptFormat: { content: string; role: `${MessageRolesGPT}` };
  timestamp: string;
};

export type SessionType = {
  user: {
    username: string | null;
    messages: SessionMessageType[];
  };
  limit: {
    amountOfGptImages: number;
    amountOfGptTokens: number;
  };
  memory: {
    data: string | null;
  };
};

export type BotContextType = HydrateFlavor<
  Context & SessionFlavor<SessionType> & I18nFlavor & MenuFlavor & ConversationFlavor
>;

export type BotType = Bot<BotContextType>;
