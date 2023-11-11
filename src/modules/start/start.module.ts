import { BotType } from '@bot/app/types';
import { BotCommands } from '@bot/common/constants';

export const startModule = (bot: BotType) =>
  bot.command(BotCommands.START, async (ctx) => ctx.reply(ctx.t('start-description')));
