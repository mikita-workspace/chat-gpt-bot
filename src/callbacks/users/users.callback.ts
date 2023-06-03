import { UserRoles } from '@bot/constants';
import { addMultipleUsersConversation, addUserConversation } from '@bot/conversations';
import { inlineGoToAdminMenu, inlineGoToModeratorMenu } from '@bot/keyboards';
import { csv, logger, mongo } from '@bot/services';
import {
  BotContextType,
  DynamicUserRolesMenuCallbackType,
  DynamicUsersMenuCallbackType,
  UserModelType,
} from '@bot/types';
import { removeFile } from '@bot/utils';

export const addUserInitialCallback = async (ctx: BotContextType) => {
  await ctx.deleteMessage();
  await ctx.conversation.enter(addUserConversation.name);
};

export const addMultipleUsersCallback = async (ctx: BotContextType) => {
  await ctx.deleteMessage();
  await ctx.conversation.enter(addMultipleUsersConversation.name);
};

export const getAllUsersCallback = async (ctx: BotContextType) => {
  try {
    const users = await mongo.getUsers();
    const currentUserRole = (await mongo.getUser(String(ctx?.from?.username)))?.role;

    if (users) {
      const { filePath, filePathForReply } = await csv.createUsersCsv(
        users.filter(
          (user) =>
            currentUserRole !== UserRoles.MODERATOR ||
            ![UserRoles.ADMIN, UserRoles.SUPER_ADMIN].includes(user.role),
        ),
      );

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

    logger.error(`callbacks::users::getAllUsersCallback::${JSON.stringify(error.message)}`);
  }
};

export const changeUserRoleCallback: DynamicUserRolesMenuCallbackType = async (
  ctx,
  username,
  role,
) => {
  try {
    await mongo.updateUser(username, { role });

    await ctx.deleteMessage();
    await ctx.reply(
      ctx.t('users-menu-message-change-role-success', {
        username,
        role: ctx.t(`user-role-${role}`),
      }),
      {
        reply_markup: inlineGoToAdminMenu(ctx),
      },
    );
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    logger.error(`callbacks::users::changeUserRoleCallback::${JSON.stringify(error.message)}`);
  }
};

export const blockUnblockUserCallback: DynamicUsersMenuCallbackType = async (ctx, username) => {
  try {
    const user = await mongo.getUser(username);
    const updatedUser = await mongo.updateUser(username, { enabled: !user?.enabled });

    const answer = ctx.t(
      `users-menu-message-${!updatedUser?.enabled ? 'block' : 'unblock'}-success`,
      {
        username,
      },
    );

    await ctx.answerCallbackQuery(answer);
    ctx.menu.update();
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    logger.error(`callbacks::users::blockUnblockUserCallback::${JSON.stringify(error.message)}`);
  }
};

export const deleteUserCallback: DynamicUsersMenuCallbackType = async (ctx, username) => {
  try {
    await mongo.deleteUser(username);

    await ctx.deleteMessage();
    await ctx.reply(ctx.t('users-menu-message-delete-success', { username }), {
      reply_markup: inlineGoToAdminMenu(ctx),
    });
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    logger.error(`callbacks::users::deleteUsersCallback::${JSON.stringify(error.message)}`);
  }
};
