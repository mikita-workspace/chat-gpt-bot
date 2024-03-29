import { generateImages } from '@bot/api/gpt';
import { MAX_IMAGES_REQUEST } from '@bot/api/gpt/constants';
import { BotCommand, SELECTED_MODEL_KEY, TTL_SELECTED_MODEL_CACHE } from '@bot/common/constants';
import { gptLoader, resetSelectedModel } from '@bot/common/helpers';
import { expiresInFormat, fetchCachedData, isExpiredDate } from '@bot/common/utils';
import { inlineFeedback } from '@bot/keyboards';
import { Logger } from '@bot/services';

import { ConversationType } from './types';

export const generateImageConversation: ConversationType = async (conversation, ctx) => {
  try {
    const telegramId = Number(ctx?.from?.id);
    const messageId = Number(ctx?.message?.message_id);
    const locale = await conversation.external(() => ctx.i18n.getLocale());

    const selectedModel = await conversation.external(async () =>
      fetchCachedData(
        `${SELECTED_MODEL_KEY}-${telegramId}`,
        resetSelectedModel,
        TTL_SELECTED_MODEL_CACHE,
      ),
    );

    const { image } = selectedModel;
    const clientAccountLevel = conversation.session.client.accountLevel;

    if (
      clientAccountLevel &&
      !isExpiredDate(clientAccountLevel.expiresAt) &&
      !clientAccountLevel.images
    ) {
      return await ctx.reply(
        `${ctx.t('usage-image-limit', {
          expiresIn: expiresInFormat(clientAccountLevel.expiresAt, locale),
        })} ${ctx.t('support-contact')}`,
        { reply_to_message_id: messageId },
      );
    }

    await ctx.reply(ctx.t('image-generate'));

    const {
      message: { text: prompt },
    } = await conversation.waitFor('message:text');

    if (Object.values(BotCommand).includes(prompt.slice(1) as BotCommand)) {
      return await ctx.reply(ctx.t('image-empty-input', { command: prompt }));
    }

    let amountOfImages = 1;

    if (image.max > 1) {
      await ctx.reply(ctx.t('image-amount', { max: MAX_IMAGES_REQUEST }));

      const {
        message: { text: amount },
      } = await conversation.waitFor('message:text');

      if (Object.values(BotCommand).includes(amount.slice(1) as BotCommand)) {
        return await ctx.reply(ctx.t('image-empty-input', { command: amount }));
      }

      amountOfImages = Number(amount) || 1;
    }

    const message = await gptLoader(ctx, messageId, { isImageGenerator: true });

    const response = await conversation.external(() =>
      generateImages(telegramId, messageId, image.model, {
        amount: Math.min(amountOfImages, MAX_IMAGES_REQUEST),
        prompt,
      }),
    );

    await message.delete();

    if (!response) {
      return await ctx.reply(ctx.t('error-message-common'), {
        reply_to_message_id: messageId,
      });
    }

    const aiMessage = `<b>Prompt: </b>${prompt}${
      response.revisedPrompt ? `\n\r<b>Revised prompt: </b>${response.revisedPrompt}` : ''
    }`;

    conversation.session.store.data = aiMessage;
    conversation.session.client.accountLevel = response.clientAccountLevel;

    await ctx.replyWithMediaGroup(
      response.images.map((img) => ({ type: 'photo', media: img.url })),
    );

    return await ctx.reply(`${aiMessage}\n\r\n\r<b>${ctx.t('image-feedback')}</b>`, {
      disable_web_page_preview: true,
      parse_mode: 'HTML',
      reply_markup: inlineFeedback(ctx, { isImageGenerator: true }),
      reply_to_message_id: messageId,
    });
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    Logger.error({
      context: 'src/conversations/create-image.conversation.ts::generateImageConversation',
      message: error.message,
      stack: JSON.stringify(error),
    });

    return;
  }
};
