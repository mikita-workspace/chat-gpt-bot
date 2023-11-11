import { ClientAvailabilityResponse } from '@bot/api/clients/types';
import { MessageRolesGPT, ModelGPT } from '@bot/api/gpt/constants';
import { ConversationFlavor } from '@grammyjs/conversations';
import { HydrateFlavor } from '@grammyjs/hydrate';
import { I18nFlavor } from '@grammyjs/i18n';
import { MenuFlavor } from '@grammyjs/menu';
import { Bot, Context, SessionFlavor } from 'grammy';

export type SessionMessageType = { content: string; role: `${MessageRolesGPT}` };

export type SessionType = {
  client: {
    messages: SessionMessageType[];
    models: ClientAvailabilityResponse['models'];
    selectedGptModel: `${ModelGPT}`;
    username: string | null;
    rate: ClientAvailabilityResponse['rate'] | null;
  };
};

export type BotContextType = HydrateFlavor<
  Context & SessionFlavor<SessionType> & I18nFlavor & MenuFlavor & ConversationFlavor
>;

export type BotType = Bot<BotContextType>;
