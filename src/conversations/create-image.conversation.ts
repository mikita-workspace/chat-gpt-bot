import { generateImages } from '@bot/api/gpt';
import { ConversationType } from '@bot/conversations/types';
import { Logger } from '@bot/services';

export const generateImageConversation: ConversationType = async (conversation, ctx) => {
  try {
    const telegramId = Number(ctx?.from?.id);
    const messageId = Number(ctx.message?.message_id);

    const { image } = ctx.session.client.selectedModel;

    await ctx.reply('Опишите, какую картинку вы хотите сгенерировать');

    const {
      message: { text: prompt },
    } = await conversation.waitFor('message:text');

    await ctx.reply('Укажите количество изображений (от 1 до 3)');

    const {
      message: { text: amount },
    } = await conversation.waitFor('message:text');

    const response = await generateImages(telegramId, messageId, image.model, {
      amount: Number(amount) || 1,
      prompt,
    });

    if (response) {
      await ctx.replyWithMediaGroup(
        response?.images.map((img) => ({ type: 'photo', media: img.url })),
        {
          reply_to_message_id: messageId,
        },
      );
    }

    return;
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    Logger.error(
      `src/conversations/create-image.conversation.ts::generateImageConversation::${JSON.stringify(
        error.message,
      )}`,
    );

    return;
  }
  // try {
  //   const currentUsername = String(ctx.from?.username);
  //   await ctx.reply(
  //     ctx.t('image-generator-enter-request', { gptImageQuery: CREATE_IMAGE_QUERY_FORMAT }),
  //     { reply_markup: inlineGoToChat(ctx) },
  //   );
  //   const {
  //     message: { text, message_id: messageId },
  //   } = await conversation.waitFor('message:text');
  //   const [prompt = '', numberOfImages = 1] = text?.trim().split(';');
  //   const botCommands = Object.values(BotCommands);
  //   if (botCommands.includes(prompt.slice(1) as BotCommands)) {
  //     return await ctx.reply(ctx.t('info-message-conversation-cancel', { command: prompt }));
  //   }
  //   if (Number.isNaN(Number(numberOfImages))) {
  //     return await ctx.reply(ctx.t('image-generator-incorrect-image-number'), {
  //       reply_to_message_id: messageId,
  //       reply_markup: inlineCreateImage(ctx),
  //     });
  //   }
  //   const base64Images = (
  //     await conversation.external(async () => openAI.generateImage(prompt, Number(numberOfImages)))
  //   ).map((base64Image) => ({
  //     base64: base64Image.b64_json ?? '',
  //     filename: `dalee2-${currentUsername}-${generateUniqueId()}`,
  //   }));
  //   // conversation.session.client.rate.images += base64Images.length;
  //   const imageFiles = await conversation.external(async () => convertBase64ToFiles(base64Images));
  //   const googleDriveFiles = imageFiles.map(({ filePath }) => ({
  //     fileName: `dalee2-${currentUsername}-${generateUniqueId()}`,
  //     filePath,
  //     fileMimeType: 'image/png',
  //   }));
  //   const inputMediaFiles: InputMediaPhoto[] = imageFiles.map(({ filePathForReply }) => ({
  //     type: 'photo',
  //     media: filePathForReply,
  //   }));
  //   let userFolder = (
  //     await google.searchFolder(currentUsername, config.GOOGLE_DRIVE_ROOT_IMAGE_FOLDER_ID)
  //   ).files?.[0];
  //   if (!userFolder) {
  //     userFolder = await google.createFolder(
  //       currentUsername,
  //       config.GOOGLE_DRIVE_ROOT_IMAGE_FOLDER_ID,
  //     );
  //   }
  //   if (userFolder.id) {
  //     const images = await google.saveFiles(googleDriveFiles, userFolder.id);
  //     await mongo.setUserImages(currentUsername, userFolder.id, {
  //       prompt,
  //       imageLinks: images.map(({ webViewLink }) => String(webViewLink)),
  //     });
  //   }
  // await ctx.replyWithMediaGroup(inputMediaFiles, {
  //   reply_to_message_id: messageId,
  // });
  //   imageFiles.forEach(({ filePath }) => removeFile(filePath));
  //   return;
  // } catch (error) {
  //   await ctx.reply(ctx.t('error-message-common'));
  //   Logger.error(`conversations::createImageConversation::${JSON.stringify(error.message)}`);
  //   return;
  // }
};
