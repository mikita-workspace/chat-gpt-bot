import { adminInlineGoToMainMenu } from '../../menu';
import { mongo } from '../../services';
import { UserRoles, ADD_USER_FORMAT } from '../../constants';
import { BotContextType } from '../../types';
import { getHtmlForUsers } from '../../helpers';

export const addUserInitialCallback = async (ctx: BotContextType) => {
  await ctx.reply(ctx.t('admin-enter-user', { inputFormat: ADD_USER_FORMAT }));
};

export const addUserCallback = async (ctx: BotContextType) => {
  const [username = '', role = ''] = (ctx?.update?.message?.text ?? '')
    .replace(/;/g, '')
    .split('#')
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
    console.error(`ERROR::Callbacks::Users::addUserCallback::${(error as Error).message}`);
  }
};

export const getAllUsersCallback = async (ctx: BotContextType) => {
  try {
    const chatId = ctx?.chat?.id ?? '';

    const users = await mongo.getUsers();

    await ctx.deleteMessage();
    await ctx.api.sendMessage(chatId, getHtmlForUsers(ctx, users), {
      parse_mode: 'HTML',
      reply_markup: adminInlineGoToMainMenu(ctx),
    });
  } catch (error) {
    await ctx.reply(ctx.t('error-common'));
    console.error(`ERROR::Callbacks::Users::getAllUsersCallback::${(error as Error).message}`);
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
    console.error(`ERROR::Callbacks::Users::blockUnblockUserCallback::${(error as Error).message}`);
  }
};
