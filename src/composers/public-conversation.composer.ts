import { BotContextType } from '@bot/app/types';
import { supportConversation } from '@bot/conversations';
import { conversations, createConversation } from '@grammyjs/conversations';
import { Composer, Middleware } from 'grammy';

const composer = new Composer<BotContextType>();

composer.use(conversations());

composer.use(createConversation(supportConversation));

export const publicConversationComposer = (): Middleware<BotContextType> => composer;
