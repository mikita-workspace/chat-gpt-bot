import { BotCommands } from '@bot/constants';
import { BotType } from '@bot/types';

export const profileCommand = (bot: BotType) =>
  bot.command(BotCommands.PROFILE, async (ctx) => ctx.reply(ctx.t('initial-message-start')));
