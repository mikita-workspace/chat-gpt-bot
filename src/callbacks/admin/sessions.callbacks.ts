import { adminInlineGoToMainMenu } from '../../menu';
import { mongo, csv } from '../../services';
import { BotContextType } from '../../types';
import { removeFile } from '../../utils';

export const getUserSessionMessages = async (username: string, ctx: BotContextType) => {
  try {
    const userSession = await mongo.getUserSession(username);

    if (userSession) {
      const { filePath, filePathForReply } = (await csv.createSessionCsv(userSession)) ?? {};

      if (filePath && filePathForReply) {
        await ctx.deleteMessage();
        await ctx.replyWithDocument(filePathForReply, {
          reply_markup: adminInlineGoToMainMenu(ctx),
        });

        await removeFile(filePath);
      }
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
