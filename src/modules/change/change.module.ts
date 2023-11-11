import { BotType } from '@bot/app/types';
import { BotCommands } from '@bot/common/constants';
import { changeGptModelConversation } from '@bot/conversations';

export const changeModule = (bot: BotType) =>
  bot.command(BotCommands.CHANGE_MODEL, async (ctx) => {
    await ctx.conversation.enter(changeGptModelConversation.name);
  });
