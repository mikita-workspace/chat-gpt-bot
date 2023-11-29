import { BotContextType } from '@bot/app/types';
import {
  changeGptModelConversation,
  generateImageConversation,
  visionConversation,
} from '@bot/conversations';
import { conversations, createConversation } from '@grammyjs/conversations';
import { Composer, Middleware } from 'grammy';

const composer = new Composer<BotContextType>();

composer.use(conversations());

composer.use(createConversation(changeGptModelConversation));
composer.use(createConversation(generateImageConversation));
composer.use(createConversation(visionConversation));

export const conversationComposer = (): Middleware<BotContextType> => composer;
