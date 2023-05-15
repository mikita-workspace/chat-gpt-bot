import { adminInlineGoToMainMenu } from '@bot/menu';
import { csv, logger, mongo } from '@bot/services';
import { BotContextType } from '@bot/types';
import { removeFile } from '@bot/utils';

export const getUserSessionMessagesCallback = async (username: string, ctx: BotContextType) => {
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
    }
  } catch (error) {
    await ctx.reply(ctx.t('error-common'));

    logger.error(`callbacks::sessions::getUserSessionMessages::${(error as Error).message}`);
  }
};

export const deleteUserSessionMessagesCallback = async (username: string, ctx: BotContextType) => {
  try {
    await mongo.deleteUserSessionMessages(username);

    await ctx.deleteMessage();
    await ctx.reply(ctx.t('admin-delete-session-successful', { username }), {
      reply_markup: adminInlineGoToMainMenu(ctx),
    });
  } catch (error) {
    await ctx.reply(ctx.t('error-common'));

    logger.error(`callbacks::sessions::deleteUserSessionMessages::${(error as Error).message}`);
  }
};
