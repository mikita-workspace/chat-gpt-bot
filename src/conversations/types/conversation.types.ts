import { BotContextType } from '@bot/app/types';
import { Conversation } from '@grammyjs/conversations';

export type ConversationType = (
  conversation: Conversation<BotContextType>,
  ctx: BotContextType,
) => void;
