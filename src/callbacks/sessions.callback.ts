import { adminInlineGoToMainMenu } from '@bot/keyboards';
import { csv, logger, mongo } from '@bot/services';
import { DynamicUsersMenuCallbackType } from '@bot/types';
import { removeFile } from '@bot/utils';

export const getUserSessionMessagesCallback: DynamicUsersMenuCallbackType = async (
  ctx,
  username,
) => {
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

    logger.error(`callbacks::sessions::getUserSessionMessagesCallback::${error.message}`);
  }
};

export const deleteUserSessionMessagesCallback: DynamicUsersMenuCallbackType = async (
  ctx,
  username,
) => {
  try {
    await mongo.deleteUserSessionMessages(username);

    await ctx.deleteMessage();
    await ctx.reply(ctx.t('admin-delete-session-successful', { username }), {
      reply_markup: adminInlineGoToMainMenu(ctx),
    });
  } catch (error) {
    await ctx.reply(ctx.t('error-common'));

    logger.error(`callbacks::sessions::deleteUserSessionMessagesCallback::${error.message}`);
  }
};
