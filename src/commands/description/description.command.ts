import { BotCommands } from '@bot/constants';
import { BotType } from '@bot/types';

export const descriptionCommand = (bot: BotType) =>
  bot.command(BotCommands.DESCRIPTION, async (ctx) =>
    ctx.reply(ctx.t('initial-message-description')),
  );
