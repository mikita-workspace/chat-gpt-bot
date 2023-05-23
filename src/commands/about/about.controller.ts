import { BotCommands } from '@bot/constants';
import { BotType } from '@bot/types';

export const aboutController = (bot: BotType) =>
  bot.command(BotCommands.ABOUT, async (ctx) => ctx.reply(ctx.t('bot-about')));
