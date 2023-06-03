import { config } from '@bot/config';
import { ADD_USER_CSV_FORMAT, REGEXP_CSV_FILE_TYPE } from '@bot/constants';
import { getFileTelegramApiLink, mapUsersFromCsv } from '@bot/helpers';
import { inlineAddNewMultipleUsers, inlineGoToAdminMenu } from '@bot/keyboards';
import { csv, logger, mongo } from '@bot/services';
import { ConversationType, UserModelType } from '@bot/types';

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

    const csvFileApiLink = getFileTelegramApiLink(config.TELEGRAM_TOKEN, csvFile.file_path ?? '');

    const csvPath = await csv.createCsv(csvFileApiLink, 'users');
    const parsedCsv = await csv.parseCsv<UserModelType>(csvPath);

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
