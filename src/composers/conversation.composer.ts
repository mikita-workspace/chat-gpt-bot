import { changeGptModelConversation, createImageConversation } from '@bot/conversations';
import { BotContextType } from '@bot/types';
import { conversations, createConversation } from '@grammyjs/conversations';
import { Composer, Middleware } from 'grammy';

const composer = new Composer<BotContextType>();

composer.use(conversations());

composer.use(createConversation(createImageConversation));
composer.use(createConversation(changeGptModelConversation));

export const conversationComposer = (): Middleware<BotContextType> => composer;
