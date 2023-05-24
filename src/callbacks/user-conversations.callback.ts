import { adminInlineGoToMainMenu } from '@bot/keyboards';
import { csv, logger, mongo } from '@bot/services';
import { DynamicUsersMenuCallbackType } from '@bot/types';
import { removeFile, uniqBy } from '@bot/utils';

export const getUserConversationMessagesCallback: DynamicUsersMenuCallbackType = async (
  ctx,
  username,
) => {
  try {
    const userSession = await mongo.getUserSession(username);
    const userConversation = await mongo.getUserConversation(username);

    if (userSession) {
      const messages = uniqBy(
        [...(userConversation?.messages ?? []), ...(userSession?.value?.messages ?? [])],
        'timestamp',
      );

      const { filePath, filePathForReply } =
        (await csv.createSessionCsv({ key: userSession.key, value: { username, messages } })) ?? {};

      if (filePath && filePathForReply) {
        await ctx.deleteMessage();
        await ctx.replyWithDocument(filePathForReply, {
          reply_markup: adminInlineGoToMainMenu(ctx),
        });

        await removeFile(filePath);
      }
    }
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    logger.error(`callbacks::sessions::getUserConversationMessagesCallback::${error.message}`);
  }
};

export const deleteUserConversationMessagesCallback: DynamicUsersMenuCallbackType = async (
  ctx,
  username,
) => {
  try {
    await mongo.deleteUserConversation(username);

    await ctx.deleteMessage();
    await ctx.reply(ctx.t('conversations-menu-delete-success', { username }), {
      reply_markup: adminInlineGoToMainMenu(ctx),
    });
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    logger.error(`callbacks::sessions::deleteUserConversationMessagesCallback::${error.message}`);
  }
};
