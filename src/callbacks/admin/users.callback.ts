import { adminInlineGoToMainMenu } from '@bot/keyboards';
import { csv, logger, mongo } from '@bot/services';
import { BotContextType } from '@bot/types';
import { removeFile } from '@bot/utils';

export const addUserInitialCallback = async (ctx: BotContextType) => {
  await ctx.deleteMessage();
  await ctx.conversation.enter('addUserConversation');
};

export const getAllUsersCallback = async (ctx: BotContextType) => {
  try {
    const users = await mongo.getUsers();

    if (users) {
      const { filePath, filePathForReply } = (await csv.createUsersCsv(users)) ?? {};

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

    logger.error(`callbacks::users::getAllUsersCallback::${(error as Error).message}`);
  }
};

export const blockUnblockUserCallback = async (username: string, ctx: BotContextType) => {
  try {
    const user = await mongo.getUser(username);
    const updatedUser = await mongo.updateUser(username, !user.enabled);

    const answer = ctx.t(
      !updatedUser?.enabled
        ? 'admin-block-block-user-successful'
        : 'admin-block-unblock-user-successful',
      {
        username,
      },
    );

    await ctx.answerCallbackQuery(answer);
  } catch (error) {
    await ctx.reply(ctx.t('error-common'));

    logger.error(`callbacks::users::blockUnblockUserCallback::${(error as Error).message}`);
  }
};
