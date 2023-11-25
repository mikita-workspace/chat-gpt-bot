import { BotType } from '@bot/app/types';
import { BotCommand } from '@bot/common/constants';
import { changeGptModelConversation } from '@bot/conversations';

export const changeModule = (bot: BotType) =>
  bot.command(BotCommand.CHANGE_MODEL, async (ctx) =>
    ctx.conversation.enter(changeGptModelConversation.name),
  );
