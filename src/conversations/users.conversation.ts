import { ADD_USER_FORMAT, REGEXP_USERNAME, UserRoles } from '@bot/constants';
import {
  adminInlineAddNewUser,
  adminInlineGoToMainMenu,
  adminInlineListUsers,
  adminInlineSelectRole,
} from '@bot/keyboards';
import { logger, mongo } from '@bot/services';
import { BotContextType, UserModelType } from '@bot/types';
import { Conversation } from '@grammyjs/conversations';

export const addUserConversation = async (
  conversation: Conversation<BotContextType>,
  ctx: BotContextType,
) => {
  try {
    await ctx.reply(ctx.t('admin-enter-user', { inputFormat: ADD_USER_FORMAT }), {
      reply_markup: adminInlineGoToMainMenu(ctx),
    });

    const {
      message: { text, message_id: messageId },
    } = await conversation.waitFor('message:text');

    const username = text.trim();

    if (!REGEXP_USERNAME.test(username)) {
      return await ctx.reply(ctx.t('admin-add-user-error', { username }), {
        reply_to_message_id: messageId,
        reply_markup: adminInlineAddNewUser(ctx),
      });
    }

    const hasUserInDb = await conversation.external(() => mongo.getUser(username));

    if (hasUserInDb) {
      return await ctx.reply(ctx.t('admin-add-user-exist', { username }), {
        reply_to_message_id: messageId,
        reply_markup: adminInlineAddNewUser(ctx),
      });
    }

    await ctx.reply(ctx.t('admin-select-role'), {
      reply_markup: adminInlineSelectRole,
    });

    const {
      update: {
        callback_query: { data: roleData, message: callbackMessageRole },
      },
    } = await conversation.waitForCallbackQuery(/admin-select-role-action/gm);

    const role = roleData.replace(/admin-select-role-action-/, '');

    await conversation.external(() => mongo.setUser(username, role));

    await ctx.api.deleteMessage(
      Number(callbackMessageRole?.chat.id),
      Number(callbackMessageRole?.message_id),
    );

    return await ctx.reply(ctx.t('admin-add-user-successful', { username }), {
      reply_to_message_id: messageId,
      reply_markup: adminInlineGoToMainMenu(ctx),
    });
  } catch (error) {
    await ctx.reply(ctx.t('error-common'));

    logger.error(`conversations::addUserConversation::${(error as Error).message}`);

    return;
  }
};

export const changeUserRoleConversation = async (
  conversation: Conversation<BotContextType>,
  ctx: BotContextType,
) => {
  try {
    const currentUsername = String(ctx?.from?.username);

    const users: UserModelType[] = await mongo.getUsers();
    const filteredUsers = users.filter((user) => user.username !== currentUsername);

    await ctx.reply(ctx.t('admin-change-role-user-select-list'), {
      reply_markup: adminInlineListUsers(ctx, filteredUsers),
    });

    const {
      update: {
        callback_query: { data: usernameData, message: callbackMessageUserList },
      },
    } = await conversation.waitForCallbackQuery(/admin-list-users-action/gm);

    const selectedUsername = usernameData.replace(/admin-list-users-action-/, '');

    await ctx.api.deleteMessage(
      Number(callbackMessageUserList?.chat.id),
      Number(callbackMessageUserList?.message_id),
    );

    await ctx.reply(ctx.t('admin-select-role'), {
      reply_markup: adminInlineSelectRole,
    });

    const {
      update: {
        callback_query: { data: roleData, message: callbackMessageRole },
      },
    } = await conversation.waitForCallbackQuery(/admin-select-role-action/gm);

    const role = roleData.replace(/admin-select-role-action-/, '') as `${UserRoles}`;

    await ctx.api.deleteMessage(
      Number(callbackMessageRole?.chat.id),
      Number(callbackMessageRole?.message_id),
    );

    await mongo.updateUser(selectedUsername, { role });

    await ctx.reply(ctx.t('admin-change-role-successful', { username: selectedUsername, role }), {
      reply_markup: adminInlineGoToMainMenu(ctx),
    });
  } catch (error) {
    await ctx.reply(ctx.t('error-common'));

    logger.error(`conversations::changeUserRoleConversation::${(error as Error).message}`);

    return;
  }
};
