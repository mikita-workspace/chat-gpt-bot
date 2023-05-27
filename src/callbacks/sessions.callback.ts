import { UserRoles } from '@bot/constants';
import { inlineGoToAdminMenu, inlineGoToModeratorMenu } from '@bot/keyboards';
import { csv, logger, mongo } from '@bot/services';
import { DynamicUsersMenuCallbackType } from '@bot/types';
import { removeFile } from '@bot/utils';

export const getUserSessionMessagesCallback: DynamicUsersMenuCallbackType = async (
  ctx,
  username,
) => {
  try {
    const userSession = await mongo.getUserSession(username);
    const currentUserRole = await mongo.getUser(String(ctx?.from?.username));

    if (userSession) {
      const { filePath, filePathForReply } = (await csv.createSessionCsv(userSession)) ?? {};

      if (filePath && filePathForReply) {
        await ctx.deleteMessage();
        await ctx.replyWithDocument(filePathForReply, {
          reply_markup:
            currentUserRole === UserRoles.MODERATOR
              ? inlineGoToModeratorMenu(ctx)
              : inlineGoToAdminMenu(ctx),
        });

        await removeFile(filePath);
      }
    }
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

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
    await ctx.reply(ctx.t('sessions-menu-message-delete-success', { username }), {
      reply_markup: inlineGoToAdminMenu(ctx),
    });
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    logger.error(`callbacks::sessions::deleteUserSessionMessagesCallback::${error.message}`);
  }
};
