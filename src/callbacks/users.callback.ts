import { UserRoles } from '@bot/constants';
import { addUserConversation } from '@bot/conversations';
import { adminInlineGoToMainMenu } from '@bot/keyboards';
import { csv, logger, mongo } from '@bot/services';
import { BotContextType } from '@bot/types';
import { removeFile } from '@bot/utils';

export const addUserInitialCallback = async (ctx: BotContextType) => {
  await ctx.deleteMessage();
  await ctx.conversation.enter(addUserConversation.name);
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

export const changeUserRoleCallback = async (
  ctx: BotContextType,
  username: string,
  role: `${UserRoles}`,
) => {
  try {
    await mongo.updateUser(username, { role });

    await ctx.deleteMessage();
    await ctx.reply(ctx.t('admin-change-role-successful', { username, role }), {
      reply_markup: adminInlineGoToMainMenu(ctx),
    });
  } catch (error) {
    await ctx.reply(ctx.t('error-common'));

    logger.error(`callbacks::users::changeUserRoleCallback::${(error as Error).message}`);
  }
};

export const blockUnblockUserCallback = async (ctx: BotContextType, username: string) => {
  try {
    const user = await mongo.getUser(username);
    const updatedUser = await mongo.updateUser(username, { enabled: !user.enabled });

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

export const deleteUserCallback = async (ctx: BotContextType, username: string) => {
  try {
    await mongo.deleteUser(username);

    await ctx.deleteMessage();
    await ctx.reply(ctx.t('admin-block-block-user-successful', { username }), {
      reply_markup: adminInlineGoToMainMenu(ctx),
    });
  } catch (error) {
    await ctx.reply(ctx.t('error-common'));

    logger.error(`callbacks::users::deleteUsersCallback::${(error as Error).message}`);
  }
};
