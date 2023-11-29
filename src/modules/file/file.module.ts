import { BotType } from '@bot/app/types';
import { visionConversation } from '@bot/conversations';

export const fileModule = (bot: BotType) =>
  bot.on('message:photo', async (ctx) => ctx.conversation.enter(visionConversation.name));
