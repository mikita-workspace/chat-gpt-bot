import { updateUserConversationMessagesCallback } from '@bot/callbacks';
import { BotCommands } from '@bot/constants';
import { inlineGoToChat } from '@bot/keyboards';
import { BotType } from '@bot/types';

export const clearCommand = (bot: BotType) =>
  bot.command(BotCommands.CLEAR, async (ctx) => {
    const currentUsername = String(ctx.from?.username);

    await updateUserConversationMessagesCallback(ctx, currentUsername);

    await ctx.reply(ctx.t('info-message-clear-current-session'), {
      reply_markup: inlineGoToChat(ctx),
    });
  });
