import { config } from '@bot/config';
import { BotCommands, CREATE_IMAGE_QUERY_FORMAT } from '@bot/constants';
import { convertBase64ToFiles } from '@bot/helpers';
import { inlineCreateImage, inlineGoToChat } from '@bot/keyboards';
import { google, logger, mongo, openAI } from '@bot/services';
import { ConversationType } from '@bot/types';
import { generateUniqueId, removeFile } from '@bot/utils';
import { InputMediaPhoto } from 'grammy/types';

export const createImageConversation: ConversationType = async (conversation, ctx) => {
  try {
    const currentUsername = String(ctx.from?.username);

    await ctx.reply(
      ctx.t('image-generator-enter-request', { gptImageQuery: CREATE_IMAGE_QUERY_FORMAT }),
      { reply_markup: inlineGoToChat(ctx) },
    );

    const {
      message: { text, message_id: messageId },
    } = await conversation.waitFor('message:text');

    const [prompt = '', numberOfImages = 1] = text?.trim().split(';');
    const botCommands = Object.values(BotCommands);

    if (botCommands.includes(prompt.slice(1) as BotCommands)) {
      return await ctx.reply(ctx.t('info-message-conversation-cancel', { command: prompt }));
    }

    if (Number.isNaN(Number(numberOfImages))) {
      return await ctx.reply(ctx.t('image-generator-incorrect-image-number'), {
        reply_to_message_id: messageId,
        reply_markup: inlineCreateImage(ctx),
      });
    }

    const base64Images = (
      await conversation.external(async () => openAI.generateImage(prompt, Number(numberOfImages)))
    ).map((base64Image) => ({
      base64: base64Image.b64_json ?? '',
      filename: `dalee2-${currentUsername}-${generateUniqueId()}`,
    }));

    conversation.session.settings.amountOfGptImages += base64Images.length;

    const imageFiles = await conversation.external(async () => convertBase64ToFiles(base64Images));

    const googleDriveFiles = imageFiles.map(({ filePath }) => ({
      fileName: `dalee2-${currentUsername}-${generateUniqueId()}`,
      filePath,
      fileMimeType: 'image/png',
    }));

    const inputMediaFiles: InputMediaPhoto[] = imageFiles.map(({ filePathForReply }) => ({
      type: 'photo',
      media: filePathForReply,
    }));

    let userFolder = (
      await google.searchFolder(currentUsername, config.GOOGLE_DRIVE_ROOT_IMAGE_FOLDER_ID)
    ).files?.[0];

    if (!userFolder) {
      userFolder = await google.createFolder(
        currentUsername,
        config.GOOGLE_DRIVE_ROOT_IMAGE_FOLDER_ID,
      );
    }

    if (userFolder.id) {
      const images = await google.saveFiles(googleDriveFiles, userFolder.id);
      await mongo.setUserImages(currentUsername, userFolder.id, {
        prompt,
        imageLinks: images.map(({ webViewLink }) => String(webViewLink)),
      });
    }

    await ctx.replyWithMediaGroup(inputMediaFiles, {
      reply_to_message_id: messageId,
    });

    imageFiles.forEach(({ filePath }) => removeFile(filePath));

    return;
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    logger.error(`conversations::createImageConversation::${JSON.stringify(error.message)}`);

    return;
  }
};
