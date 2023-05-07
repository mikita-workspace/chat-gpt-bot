import { BotContextType, BotType } from '../../types';
import { mongo } from '../../services';
import { adminMainMenu } from '../../menu';
import { getHtmlForSessionMessages } from '../../helpers';
import { addUserCallback } from '../../callbacks';
import { REGEXP_ADD_USER_INPUT } from '../../constants';

export const adminController = async (bot: BotType) => {
  // bot.on('callback_query', async (ctx) => {
  //   const action = ctx?.update?.callback_query?.data ?? '';
  //   const firstName = ctx?.update?.message?.from.first_name ?? '';
  //   const botName = ctx?.me?.first_name ?? '';

  //   switch (action) {
  //     case CallbackQueryActions.SESSIONS:
  //       return ctx.reply(ctx.t('admin-sessions'), {
  //         reply_markup: getSessionsInlineKeyboard(ctx),
  //       });
  //     case CallbackQueryActions.GET_SESSION:
  //       return;
  //     case CallbackQueryActions.DELETE_SESSION:
  //       return;
  //     case CallbackQueryActions.USERS:
  //       return ctx.reply(ctx.t('admin-users'), {
  //         reply_markup: getUsersInlineKeyboard(ctx),
  //       });
  //     case CallbackQueryActions.ADD_USER:
  //     // await ctx.reply(
  //     //   ctx.t('admin-enter-user', { inputFormat: '[username]' }),
  //     // );

  //     case CallbackQueryActions.GO_BACK:
  //       await ctx.deleteMessage();

  //       return ctx.reply(
  //         ctx.t('admin-initial', {
  //           firstName,
  //           botName,
  //         }),
  //         { reply_markup: getMainInlineKeyboard(ctx) },
  //       );
  //     default:
  //       return ctx.answerCallbackQuery({
  //         text: ctx.t('error-common'),
  //       });
  //   }
  // });

  bot.hears(REGEXP_ADD_USER_INPUT, addUserCallback);

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
      { reply_markup: adminMainMenu },
    );
  });
};
