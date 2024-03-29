import { ClientAccountLevel, ClientMetadata } from '@bot/api/clients/types';
import { MessageRolesGPT } from '@bot/api/gpt/constants';
import { ConversationFlavor } from '@grammyjs/conversations';
import { FileFlavor } from '@grammyjs/files';
import { HydrateFlavor } from '@grammyjs/hydrate';
import { I18nFlavor } from '@grammyjs/i18n';
import { MenuFlavor } from '@grammyjs/menu';
import { Bot, Context, SessionFlavor } from 'grammy';

export type SessionMessageType = { content: string; role: `${MessageRolesGPT}` };

export type SessionType = {
  client: {
    messages: SessionMessageType[];
    metadata: ClientMetadata;
    accountLevel: ClientAccountLevel | null;
  };
  store: {
    data: unknown;
  };
};

export type SelectedModelType = {
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
  vision: {
    model: string | null;
    title: string | null;
  };
};

export type BotContextType = FileFlavor<
  HydrateFlavor<Context & SessionFlavor<SessionType> & I18nFlavor & MenuFlavor & ConversationFlavor>
>;

export type BotType = Bot<BotContextType>;
