import { BotCommands } from '@bot/constants';
import { inlineGoToChat } from '@bot/keyboards';
import { mongo } from '@bot/services';
import { BotType } from '@bot/types';

export const clearCommand = (bot: BotType) =>
  bot.command(BotCommands.CLEAR, async (ctx) => {
    const currentUsername = String(ctx.from?.username);

    await mongo.updateUserConversation(currentUsername, ctx.session.custom.messages);

    ctx.session.custom.messages = [];
    ctx.session.custom.images = [];

    await ctx.reply(ctx.t('info-message-clear-current-session'), {
      reply_markup: inlineGoToChat(ctx),
    });
  });
