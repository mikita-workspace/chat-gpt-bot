import { BotCommands } from '@bot/constants';
import { inlineGoToChat } from '@bot/keyboards';
import { BotType } from '@bot/types';

export const descriptionCommand = (bot: BotType) =>
  bot.command(BotCommands.DESCRIPTION, async (ctx) =>
    ctx.reply(ctx.t('description-message', { model: ctx.session.settings.selectedGPTModel }), {
      reply_markup: inlineGoToChat(ctx),
    }),
  );
