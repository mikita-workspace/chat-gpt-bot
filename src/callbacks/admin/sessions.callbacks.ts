import { adminInlineGoToMainMenu } from '../../menu';
import { mongo } from '../../services';
import { BotContextType } from '../../types';
import { getHtmlForSessionMessages } from '../../helpers';

export const getUserSessionMessages = async (username: string, ctx: BotContextType) => {
  try {
    const chatId = ctx?.chat?.id ?? '';

    const userMessages = (await mongo.getUserSessionMessages(username)) ?? [];

    if (userMessages.length > 0) {
      await ctx.deleteMessage();
      await ctx.api.sendMessage(chatId, getHtmlForSessionMessages(userMessages, ctx), {
        parse_mode: 'HTML',
        reply_markup: adminInlineGoToMainMenu(ctx),
      });
    } else {
      await ctx.deleteMessage();
      await ctx.reply(ctx.t('admin-delete-session-not-found', { username }), {
        reply_markup: adminInlineGoToMainMenu(ctx),
      });
    }
  } catch (error) {
    await ctx.reply(ctx.t('error-common'));
    console.error(
      `ERROR::Callbacks::Sessions::getUserSessionMessages::${(error as Error).message}`,
    );
  }
};

export const deleteUserSessionMessages = async (username: string, ctx: BotContextType) => {
  try {
    await mongo.deleteUserSessionMessages(username);

    await ctx.deleteMessage();
    await ctx.reply(ctx.t('admin-delete-session-successful', { username }), {
      reply_markup: adminInlineGoToMainMenu(ctx),
    });
  } catch (error) {
    await ctx.reply(ctx.t('error-common'));
    console.error(
      `ERROR::Callbacks::Sessions::deleteUserSessionMessages::${(error as Error).message}`,
    );
  }
};
