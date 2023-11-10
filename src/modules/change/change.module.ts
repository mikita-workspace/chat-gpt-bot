import { BotCommands } from '@bot/common/constants';
import { changeGptModelConversation } from '@bot/conversations';
import { BotType } from '@bot/types';

export const changeModule = (bot: BotType) =>
  bot.command(BotCommands.CHANGE_MODEL, async (ctx) => {
    await ctx.conversation.enter(changeGptModelConversation.name);
  });
