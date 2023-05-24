import { BotCommands } from '@bot/constants';
import { BotType } from '@bot/types';

export const aboutCommand = (bot: BotType) =>
  bot.command(BotCommands.ABOUT, async (ctx) => ctx.reply(ctx.t('initial-message-about')));
