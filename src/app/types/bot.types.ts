import { ClientRate } from '@bot/api/clients/types';
import { MessageRolesGPT } from '@bot/api/gpt/constants';
import { ConversationFlavor } from '@grammyjs/conversations';
import { HydrateFlavor } from '@grammyjs/hydrate';
import { I18nFlavor } from '@grammyjs/i18n';
import { MenuFlavor } from '@grammyjs/menu';
import { Bot, Context, SessionFlavor } from 'grammy';

export type SessionMessageType = { content: string; role: `${MessageRolesGPT}` };

export type SessionType = {
  client: {
    messages: SessionMessageType[];
    lastMessageTimestamp: number;
    metadata: {
      username: string;
      firstname: string;
      lastname: string;
    };
    rate: ClientRate | null;
    selectedModel: {
      speech: {
        model: string;
        title: string;
      };
      gpt: {
        model: string;
        title: string;
      };
      image: {
        model: string;
        title: string;
        max: number;
      };
    };
  };
};

export type BotContextType = HydrateFlavor<
  Context & SessionFlavor<SessionType> & I18nFlavor & MenuFlavor & ConversationFlavor
>;

export type BotType = Bot<BotContextType>;
