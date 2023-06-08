import { BotCommands } from '@bot/constants';
import { createImageConversation } from '@bot/conversations';
import { BotType } from '@bot/types';

export const imageCommand = (bot: BotType) =>
  bot.command(BotCommands.IMAGE, async (ctx) =>
    ctx.conversation.enter(createImageConversation.name),
  );
