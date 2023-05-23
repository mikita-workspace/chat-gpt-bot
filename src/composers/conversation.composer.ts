import { addUserConversation } from '@bot/conversations';
import { BotContextType } from '@bot/types';
import { conversations, createConversation } from '@grammyjs/conversations';
import { Composer, Middleware } from 'grammy';

const composer = new Composer<BotContextType>();

composer.use(conversations());

composer.use(createConversation(addUserConversation));

export const conversationComposer = (): Middleware<BotContextType> => composer;
