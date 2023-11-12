import { BotContextType } from '@bot/app/types';
import { changeGptModelConversation, generateImageConversation } from '@bot/conversations';
import { conversations, createConversation } from '@grammyjs/conversations';
import { Composer, Middleware } from 'grammy';

const composer = new Composer<BotContextType>();

composer.use(conversations());

composer.use(createConversation(generateImageConversation));
composer.use(createConversation(changeGptModelConversation));

export const conversationComposer = (): Middleware<BotContextType> => composer;
