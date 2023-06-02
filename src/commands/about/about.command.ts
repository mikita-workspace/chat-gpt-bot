import { BotCommands } from '@bot/constants';
import { inlineGoToChat } from '@bot/keyboards';
import { BotType } from '@bot/types';

export const aboutCommand = (bot: BotType) =>
  bot.command(BotCommands.ABOUT, async (ctx) =>
    ctx.reply(ctx.t('initial-message-about'), { reply_markup: inlineGoToChat(ctx) }),
  );
