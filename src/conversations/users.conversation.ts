import { config } from '@bot/config';
import {
  ADD_USER_CSV_FORMAT,
  addUserFormat,
  REGEXP_CSV_FILE_TYPE,
  REGEXP_USERNAME,
  UserRoles,
} from '@bot/constants';
import { getFileApiLink, mapUsersFromCsv } from '@bot/helpers';
import {
  inlineAddNewMultipleUsers,
  inlineAddNewUser,
  inlineGoToAdminMenu,
  inlineGoToModeratorMenu,
} from '@bot/keyboards';
import { csv, logger, mongo } from '@bot/services';
import { ConversationType, UserModelType } from '@bot/types';

export const addUserConversation: ConversationType = async (conversation, ctx) => {
  try {
    const currentUserRole = (
      await conversation.external(() => mongo.getUser(String(ctx.from?.username)))
    ).role;

    await ctx.reply(
      ctx.t('users-menu-message-enter', { inputFormat: addUserFormat(currentUserRole) }),
      {
        reply_markup:
          currentUserRole === UserRoles.MODERATOR
            ? inlineGoToModeratorMenu(ctx)
            : inlineGoToAdminMenu(ctx),
      },
    );

    const {
      message: { text, message_id: messageId },
    } = await conversation.waitFor('message:text');

    const [username = '', role = UserRoles.USER] = text?.trim().split(';');

    if (!REGEXP_USERNAME.test(username)) {
      return await ctx.reply(ctx.t('users-menu-message-incorrect', { username }), {
        reply_to_message_id: messageId,
        reply_markup: inlineAddNewUser(ctx),
      });
    }

    const hasUserInDb = await conversation.external(() => mongo.getUser(username));

    if (hasUserInDb) {
      return await ctx.reply(ctx.t('users-menu-message-exist', { username }), {
        reply_to_message_id: messageId,
        reply_markup: inlineAddNewUser(ctx),
      });
    }

    await conversation.external(() =>
      mongo.setUser(
        username,
        (() => {
          if (currentUserRole === UserRoles.MODERATOR) {
            return UserRoles.USER;
          }

          return Object.values(UserRoles).includes(role as UserRoles) ? role : UserRoles.USER;
        })(),
      ),
    );

    return await ctx.reply(ctx.t('users-menu-message-add-success', { username }), {
      reply_to_message_id: messageId,
      reply_markup:
        currentUserRole === UserRoles.MODERATOR
          ? inlineGoToModeratorMenu(ctx)
          : inlineGoToAdminMenu(ctx),
    });
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    logger.error(`conversations::addUserConversation::${JSON.stringify(error.message)}`);

    return;
  }
};

export const addMultipleUsersConversation: ConversationType = async (conversation, ctx) => {
  try {
    await ctx.reply(ctx.t('users-menu-message-enter-csv', { csvFormat: ADD_USER_CSV_FORMAT }), {
      reply_markup: inlineGoToAdminMenu(ctx),
    });

    const uploadedFile = await conversation.waitFor('msg:file');
    const csvFile = await uploadedFile.getFile();

    const messageId = Number(uploadedFile?.message?.message_id);

    if (!REGEXP_CSV_FILE_TYPE.test(csvFile.file_path ?? '')) {
      return await ctx.reply(ctx.t('users-menu-message-incorrect-csv'), {
        reply_to_message_id: messageId,
        reply_markup: inlineAddNewMultipleUsers(ctx),
      });
    }

    const csvFileApiLink = getFileApiLink(config.TELEGRAM_TOKEN, csvFile.file_path ?? '');

    const csvPath = (await csv.createCsv(csvFileApiLink, 'users')) ?? '';
    const parsedCsv = (await csv.parseCsv<UserModelType>(csvPath)) ?? [];

    const newUsers = await mongo.setMultipleUsers(mapUsersFromCsv(parsedCsv));

    if (newUsers?.length === 0) {
      return await ctx.reply(ctx.t('users-menu-message-multiple-add-error'), {
        reply_to_message_id: messageId,
        reply_markup: inlineAddNewMultipleUsers(ctx),
      });
    }

    return await ctx.reply(
      ctx.t('users-menu-message-multiple-add-success', {
        users: newUsers?.map((newUser) => newUser?.username).join(', ') ?? '',
      }),
      {
        reply_to_message_id: messageId,
        reply_markup: inlineGoToAdminMenu(ctx),
      },
    );
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    logger.error(`conversations::addMultipleUsersConversation::${JSON.stringify(error.message)}`);

    return;
  }
};
