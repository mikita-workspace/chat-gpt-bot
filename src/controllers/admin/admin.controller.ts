import { BotType } from '../../types';
import { mongo } from '../../services';
import {
  getHtmlForSessionMessages,
  getMainInlineKeyboard,
  getSessionsInlineKeyboard,
  getUsersInlineKeyboard,
} from '../../helpers';
import { CallbackQueryActions } from '../../constants';

export const adminController = async (bot: BotType) => {
  bot.on('callback_query', async (ctx) => {
    const action = ctx?.update?.callback_query?.data ?? '';
    const firstName = ctx?.update?.message?.from.first_name ?? '';
    const botName = ctx?.me?.first_name ?? '';

    switch (action) {
      case CallbackQueryActions.SESSIONS:
        return ctx.reply(ctx.t('admin-sessions'), {
          reply_markup: getSessionsInlineKeyboard(ctx),
        });
      case CallbackQueryActions.USERS:
        return ctx.reply(ctx.t('admin-users'), {
          reply_markup: getUsersInlineKeyboard(ctx),
        });
      case CallbackQueryActions.GO_BACK:
        return ctx.reply(
          ctx.t('admin-initial', {
            firstName,
            botName,
          }),
          { reply_markup: getMainInlineKeyboard(ctx) },
        );
      default:
        return ctx.answerCallbackQuery({
          text: ctx.t('error-common'),
        });
    }
  });

  return bot.command('admin', async (ctx) => {
    // const msg = await mongo.getUserSessionMessages('495000805');

    // await ctx.api.sendMessage(
    //   ctx.chat.id,
    //   getHtmlForSessionMessages(msg, 'error'),
    //   {
    //     parse_mode: 'HTML',
    //   },
    // );

    const firstName = ctx?.update?.message?.from.first_name ?? '';
    const botName = ctx?.me?.first_name ?? '';

    await ctx.reply(
      ctx.t('admin-initial', {
        firstName,
        botName,
      }),
      { reply_markup: getMainInlineKeyboard(ctx) },
    );
  });
};
