import { generateImages } from '@bot/api/gpt';
import { MAX_IMAGES_REQUEST, MODEL_IMAGE_DEFAULT } from '@bot/api/gpt/constants';
import { BotCommands } from '@bot/common/constants';
import { expiresInFormat, getTimestampUnix } from '@bot/common/utils';
import { ConversationType } from '@bot/conversations/types';
import { inlineFeedback } from '@bot/keyboards';
import { Logger } from '@bot/services';
import { gptLoader } from 'common/helpers';

export const generateImageConversation: ConversationType = async (conversation, ctx) => {
  try {
    const telegramId = Number(ctx?.from?.id);
    const messageId = Number(ctx?.message?.message_id);
    const locale = String(ctx.from?.language_code);

    const { image } = ctx.session.client.selectedModel;
    const rate = ctx.session.client.rate;

    if (rate && !rate.images) {
      return await ctx.reply(
        `${ctx.t('usage-image-limit', {
          expiresIn: expiresInFormat(rate.expiresAt, locale),
        })} ${ctx.t('support-contact')}`,
        { reply_to_message_id: messageId },
      );
    }

    await ctx.reply(ctx.t('image-generate'));

    const {
      message: { text: prompt },
    } = await conversation.waitFor('message:text');

    if (Object.values(BotCommands).includes(prompt.slice(1) as BotCommands)) {
      return await ctx.reply(ctx.t('image-empty-input', { command: prompt }));
    }

    let amountOfImages = 1;

    // NOTE: dal-ee-3 model support only n = 1
    if (image.model !== MODEL_IMAGE_DEFAULT.model) {
      await ctx.reply(ctx.t('image-amount', { max: MAX_IMAGES_REQUEST }));

      const {
        message: { text: amount },
      } = await conversation.waitFor('message:text');

      amountOfImages = Number(amount) || 1;
    }

    const startMessage = await gptLoader(ctx, messageId, { isImageGenerator: true });

    const response = await conversation.external(() =>
      generateImages(telegramId, messageId, image.model, {
        amount: Math.min(amountOfImages, MAX_IMAGES_REQUEST),
        prompt,
      }),
    );

    await startMessage.delete();

    if (!response) {
      return await ctx.reply(ctx.t('error-message-common'), {
        reply_to_message_id: messageId,
      });
    }

    conversation.session.client.rate = response.clientRate;
    ctx.session.client.lastMessageTimestamp = getTimestampUnix();

    await ctx.replyWithMediaGroup(
      response.images.map((img) => ({ type: 'photo', media: img.url })),
    );
    return await ctx.reply(
      `💭 ${response.revisedPrompt}\n\r\n\r<b>${ctx.t('image-feedback')}</b>`,
      {
        reply_markup: inlineFeedback(ctx, { isImageGenerator: true }),
        reply_to_message_id: messageId,
        parse_mode: 'HTML',
      },
    );
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
