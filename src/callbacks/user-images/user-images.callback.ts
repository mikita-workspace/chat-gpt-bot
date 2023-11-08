import { inlineGoToAdminMenu } from '@bot/keyboards';
import { csv, google, logger, mongo } from '@bot/services';
import { DynamicUsersMenuCallbackType } from '@bot/types';
import { removeFile } from '@bot/utils';

export const getUserImagesCsvCallback: DynamicUsersMenuCallbackType = async (ctx, username) => {
  try {
    const userImages = await mongo.getUserImages(username);

    if (userImages) {
      const { filePath, filePathForReply } = await csv.createUserImagesCsv(userImages);

      if (filePath && filePathForReply) {
        await ctx.deleteMessage();
        await ctx.replyWithDocument(filePathForReply, { reply_markup: inlineGoToAdminMenu(ctx) });

        await removeFile(filePath);
      }
    }
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    logger.error(
      `callbacks::user-images::getUserImagesCsvCallback::${JSON.stringify(error.message)}`,
    );
  } finally {
    // ctx.session.memory.userData.selectedUsername = null;
  }
};

export const getUserImagesArchiveCallback: DynamicUsersMenuCallbackType = async (ctx, username) => {
  try {
    const userImages = await mongo.getUserImages(username);

    if (userImages) {
      const { filePath, filePathForReply } = await google.downloadFolder(
        userImages.folderId,
        username,
      );

      if (filePath && filePathForReply) {
        await ctx.deleteMessage();
        await ctx.replyWithDocument(filePathForReply, { reply_markup: inlineGoToAdminMenu(ctx) });

        await removeFile(filePath);
      }
    }
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    logger.error(
      `callbacks::user-images::getUserImagesArchiveCallback::${JSON.stringify(error.message)}`,
    );
  } finally {
    // ctx.session.memory.userData.selectedUsername = null;
  }
};
