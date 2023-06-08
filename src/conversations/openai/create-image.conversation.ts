import { config } from '@bot/config';
import {
  ADD_USER_CSV_FORMAT,
  CREATE_IMAGE_QUERY_FORMAT,
  REGEXP_CSV_FILE_TYPE,
} from '@bot/constants';
import { getFileTelegramApiLink, mapUsersFromCsv } from '@bot/helpers';
import { inlineAddNewMultipleUsers, inlineCreateImage, inlineGoToChat } from '@bot/keyboards';
import { csv, logger, mongo, openAI } from '@bot/services';
import { ConversationType, UserModelType } from '@bot/types';

export const createImageConversation: ConversationType = async (conversation, ctx) => {
  try {
    await ctx.reply(
      ctx.t('image-generator-enter-request', { gptImageQuery: CREATE_IMAGE_QUERY_FORMAT }),
      { reply_markup: inlineGoToChat(ctx) },
    );

    const {
      message: { text, message_id: messageId },
    } = await conversation.waitFor('message:text');

    const [prompt = '', numberOfImages = 1] = text?.trim().split(';');

    if (Number.isNaN(Number(numberOfImages))) {
      return await ctx.reply(ctx.t('image-generator-incorrect-image-number'), {
        reply_to_message_id: messageId,
        reply_markup: inlineCreateImage(ctx),
      });
    }

    const response = conversation.external(() =>
      openAI.generateImage(prompt, Number(numberOfImages)),
    );
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    logger.error(`conversations::createImageConversation::${JSON.stringify(error.message)}`);

    return;
  }
};
