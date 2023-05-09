import { ADD_USER_FORMAT, UserRoles } from '@bot/constants';
import { adminInlineGoToMainMenu } from '@bot/menu';
import { csv, logger, mongo } from '@bot/services';
import { BotContextType } from '@bot/types';
import { removeFile } from '@bot/utils';

export const addUserInitialCallback = async (ctx: BotContextType) => {
  await ctx.deleteMessage();
  await ctx.reply(ctx.t('admin-enter-user', { inputFormat: ADD_USER_FORMAT }), {
    reply_markup: adminInlineGoToMainMenu(ctx),
  });
};

export const addUserCallback = async (ctx: BotContextType) => {
  const [username = '', role = ''] = (ctx?.update?.message?.text ?? '')
    .replace(/;/g, '')
    .split('$')
    .slice(1);
  const messageId = Number(ctx?.message?.message_id);

  try {
    const hasUser = await mongo.getUser(username);

    if (hasUser) {
      await ctx.reply(ctx.t('admin-add-user-exist', { username }), {
        reply_to_message_id: messageId,
      });
    } else {
      const hasCorrectRole = Object.values(UserRoles).includes(role as UserRoles);

      await mongo.setUser(username, hasCorrectRole ? role : UserRoles.USER);

      await ctx.reply(ctx.t('admin-add-user-successful', { username }), {
        reply_to_message_id: messageId,
        reply_markup: adminInlineGoToMainMenu(ctx),
      });
    }
  } catch (error) {
    await ctx.reply(ctx.t('error-common'));

    logger.error(`callbacks::users::addUserCallback::${(error as Error).message}`);
  }
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
