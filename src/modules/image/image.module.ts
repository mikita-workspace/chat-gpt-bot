import { BotType } from '@bot/app/types';
import { BotCommand } from '@bot/common/constants';
import { generateImageConversation } from '@bot/conversations';

export const imageModule = (bot: BotType) =>
  bot.command(BotCommand.IMAGE, async (ctx) => {
    return ctx.conversation.enter(generateImageConversation.name);
  });
