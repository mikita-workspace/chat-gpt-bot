import { MessageRolesGPT, ModelGPT } from '@bot/constants';
import { ConversationFlavor } from '@grammyjs/conversations';
import { HydrateFlavor } from '@grammyjs/hydrate';
import { I18nFlavor } from '@grammyjs/i18n';
import { MenuFlavor } from '@grammyjs/menu';
import { Bot, Context, SessionFlavor } from 'grammy';

export type SessionMessageType = { content: string; role: `${MessageRolesGPT}` };

export type SessionType = {
  client: {
    messages: SessionMessageType[];
    selectedGptModel: `${ModelGPT}`;
    username: string | null;
  };
};

export type BotContextType = HydrateFlavor<
  Context & SessionFlavor<SessionType> & I18nFlavor & MenuFlavor & ConversationFlavor
>;

export type BotType = Bot<BotContextType>;
