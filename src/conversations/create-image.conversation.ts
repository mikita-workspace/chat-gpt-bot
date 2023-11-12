import { generateImages } from '@bot/api/gpt';
import { MAX_IMAGES_REQUEST } from '@bot/api/gpt/constants';
import { BotCommands } from '@bot/common/constants';
import { getTimestampUnix } from '@bot/common/utils';
import { ConversationType } from '@bot/conversations/types';
import { inlineFeedback } from '@bot/keyboards';
import { Logger } from '@bot/services';
import { gptLoader } from 'common/helpers';

export const generateImageConversation: ConversationType = async (conversation, ctx) => {
  try {
    const telegramId = Number(ctx?.from?.id);
    const messageId = Number(ctx.message?.message_id);

    const { image } = ctx.session.client.selectedModel;

    await ctx.reply(ctx.t('image-generate'));

    const {
      message: { text: prompt },
    } = await conversation.waitFor('message:text');

    if (Object.values(BotCommands).includes(prompt.slice(1) as BotCommands)) {
      return await ctx.reply(ctx.t('image-empty-input', { command: prompt }));
    }

    await ctx.reply(ctx.t('image-amount', { max: MAX_IMAGES_REQUEST }));

    const {
      message: { text: amount },
    } = await conversation.waitFor('message:text');

    const amountOfImages = Number(amount) || 1;

    const startMessage = await gptLoader(ctx, messageId, { isImageGenerator: true });

    const response = await generateImages(telegramId, messageId, image.model, {
      amount: Math.min(amountOfImages, MAX_IMAGES_REQUEST),
      prompt,
    });

    if (!response) {
      return await ctx.reply(ctx.t('error-message-common'), { reply_to_message_id: messageId });
    }

    await startMessage.delete();

    conversation.session.client.rate = response.clientRate;
    ctx.session.client.lastMessageTimestamp = getTimestampUnix();

    await ctx.replyWithMediaGroup(
      response?.images.map((img) => ({ type: 'photo', media: img.url })),
      {
        reply_to_message_id: messageId,
      },
    );
    return await ctx.reply(ctx.t('image-feedback'), {
      reply_markup: inlineFeedback(ctx, { isImageGenerator: true }),
      reply_to_message_id: messageId,
    });
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    Logger.error(
      `src/conversations/create-image.conversation.ts::generateImageConversation::${JSON.stringify(
        error.message,
      )}`,
    );

    return;
  }
};
