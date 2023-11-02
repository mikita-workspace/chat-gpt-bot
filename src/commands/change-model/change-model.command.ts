import { BotCommands } from '@bot/constants';
import { BotType } from '@bot/types';
import { changeGptModelConversation } from 'conversations';

export const changeModelCommand = (bot: BotType) =>
  bot.command(BotCommands.CHANGE_MODEL, async (ctx) => {
    await ctx.conversation.enter(changeGptModelConversation.name);
  });
