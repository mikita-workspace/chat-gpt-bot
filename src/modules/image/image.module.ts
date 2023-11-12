import { BotType } from '@bot/app/types';
import { BotCommands } from '@bot/common/constants';
import { generateImageConversation } from '@bot/conversations';

export const imageModule = (bot: BotType) =>
  bot.command(BotCommands.IMAGE, async (ctx) => {
    return ctx.conversation.enter(generateImageConversation.name);
  });
