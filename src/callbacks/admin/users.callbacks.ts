import { mongo } from '../../services';
import { UserRoles, ADD_USER_FORMAT } from '../../constants';
import { BotContextType } from '../../types';

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
      const hasCorrectRole = Object.values(UserRoles).includes(
        role as UserRoles,
      );

      await mongo.setUser(username, hasCorrectRole ? role : UserRoles.USER);

      await ctx.reply(ctx.t('admin-add-user-successful', { username }), {
        reply_to_message_id: messageId,
      });
    }
  } catch (error) {
    await ctx.reply(ctx.t('error-common'));
    console.error(
      `ERROR::Callbacks::Users::addUserCallback::${(error as Error).message}`,
    );
  }
};
