import { BotContextType } from '@bot/types';
import { Conversation } from '@grammyjs/conversations';

export type ConversationType = (
  conversation: Conversation<BotContextType>,
  ctx: BotContextType,
) => void;
