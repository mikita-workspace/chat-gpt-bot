import { inlineGoToAdminMenu } from '@bot/keyboards';
import { csv, logger, mongo } from '@bot/services';
import { DynamicUsersMenuCallbackType } from '@bot/types';
import { removeFile } from '@bot/utils';

export const getUserImagesCallback: DynamicUsersMenuCallbackType = async (ctx, username) => {
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

    logger.error(`callbacks::user-images::getUserImagesCallback::${JSON.stringify(error.message)}`);
  }
};
