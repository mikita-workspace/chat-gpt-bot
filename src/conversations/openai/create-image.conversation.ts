import { CREATE_IMAGE_QUERY_FORMAT } from '@bot/constants';
import { inlineCreateImage, inlineGoToChat } from '@bot/keyboards';
import { logger, openAI } from '@bot/services';
import { ConversationType } from '@bot/types';
import { convertBase64ToFiles, removeFile } from '@bot/utils';
import { InputFile } from 'grammy';
import { InputMediaPhoto } from 'grammy/types';

export const createImageConversation: ConversationType = async (conversation, ctx) => {
  try {
    await ctx.reply(
      ctx.t('image-generator-enter-request', { gptImageQuery: CREATE_IMAGE_QUERY_FORMAT }),
      { reply_markup: inlineGoToChat(ctx) },
    );

    const {
      message: { text, message_id: messageId },
    } = await conversation.waitFor('message:text');

    const currentUsername = String(ctx.from?.username);
    const [prompt = '', numberOfImages = 1] = text?.trim().split(';');

    if (Number.isNaN(Number(numberOfImages))) {
      return await ctx.reply(ctx.t('image-generator-incorrect-image-number'), {
        reply_to_message_id: messageId,
        reply_markup: inlineCreateImage(ctx),
      });
    }

    const response = await conversation.external(async () =>
      openAI.generateImage(prompt, Number(numberOfImages)),
    );

    const base64Images = response.map((base64Image) => base64Image.b64_json ?? '');

    conversation.session.limit.amountOfGptImages += base64Images.length;
    conversation.session.custom.images.push({
      base64: base64Images,
      prompt,
    });

    const imageFilesPath = await conversation.external(async () =>
      convertBase64ToFiles(base64Images, `image-${currentUsername}`),
    );

    const inputMediaFiles: InputMediaPhoto[] = imageFilesPath.map((imageFilePath) => ({
      type: 'photo',
      media: new InputFile(imageFilePath),
    }));

    await ctx.replyWithMediaGroup(inputMediaFiles, {
      reply_to_message_id: messageId,
    });

    imageFilesPath.forEach((path) => removeFile(path));

    return;
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    logger.error(`conversations::createImageConversation::${JSON.stringify(error.message)}`);

    return;
  }
};
