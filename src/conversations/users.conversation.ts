import { ADD_USER_FORMAT, REGEXP_USERNAME, UserRoles } from '@bot/constants';
import { adminInlineAddNewUser, adminInlineGoToMainMenu } from '@bot/keyboards';
import { logger, mongo } from '@bot/services';
import { BotContextType } from '@bot/types';
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

    const [username = '', role = UserRoles.USER] = text?.split(';');

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

    await conversation.external(() =>
      mongo.setUser(
        username,
        Object.values(UserRoles).includes(role as UserRoles) ? role : UserRoles.USER,
      ),
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
