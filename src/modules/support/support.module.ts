import { BotType } from '@bot/app/types';
import { BotCommand } from '@bot/common/constants';
import { supportConversation } from '@bot/conversations';

export const supportModule = (bot: BotType) =>
  bot.command(BotCommand.SUPPORT, async (ctx) => ctx.conversation.enter(supportConversation.name));
