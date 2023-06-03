import { addUserFormat, REGEXP_USERNAME, UserRoles } from '@bot/constants';
import { inlineAddNewUser, inlineGoToAdminMenu, inlineGoToModeratorMenu } from '@bot/keyboards';
import { logger, mongo } from '@bot/services';
import { ConversationType } from '@bot/types';

export const addUserConversation: ConversationType = async (conversation, ctx) => {
  try {
    const currentUserRole =
      (await conversation.external(() => mongo.getUser(String(ctx.from?.username))))?.role ??
      UserRoles.USER;

    await ctx.reply(
      ctx.t('users-menu-message-enter', { inputFormat: addUserFormat(currentUserRole) }),
      {
        reply_markup: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN].includes(currentUserRole)
          ? inlineGoToAdminMenu(ctx)
          : inlineGoToModeratorMenu(ctx),
      },
    );

    const {
      message: { text, message_id: messageId },
    } = await conversation.waitFor('message:text');

    const [username = '', role = UserRoles.USER] = text?.trim().split(';') as [string, UserRoles];

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

          return Object.values(UserRoles).includes(role) ? role : UserRoles.USER;
        })(),
      ),
    );

    return await ctx.reply(ctx.t('users-menu-message-add-success', { username }), {
      reply_to_message_id: messageId,
      reply_markup: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN].includes(currentUserRole)
        ? inlineGoToAdminMenu(ctx)
        : inlineGoToModeratorMenu(ctx),
    });
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    logger.error(`conversations::addUserConversation::${JSON.stringify(error.message)}`);

    return;
  }
};
