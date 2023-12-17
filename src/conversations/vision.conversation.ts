import { visionCompletion } from '@bot/api/gpt';
import { BotCommand, FILE_EXTENSIONS, SELECTED_MODEL_KEY } from '@bot/common/constants';
import { gptLoader, resetSelectedModel } from '@bot/common/helpers';
import { getValueFromMemoryCache } from '@bot/common/utils';
import { inlineFeedback } from '@bot/keyboards';
import { Logger } from '@bot/services';

import { ConversationType } from './types';

export const visionConversation: ConversationType = async (conversation, ctx) => {
  try {
    const telegramId = Number(ctx?.from?.id);
    const messageId = Number(ctx?.message?.message_id);

    const selectedModel = await conversation.external(
      async () =>
        JSON.parse(
          (await getValueFromMemoryCache(`${SELECTED_MODEL_KEY}-${telegramId}`)) || '{}',
        ) || resetSelectedModel(),
    );

    if (!selectedModel.vision.model) {
      return await ctx.reply(ctx.t('vision-denied'), {
        reply_to_message_id: messageId,
      });
    }

    const filename = (await ctx.getFile()).file_path ?? '';
    const fileExtension = filename.split('.')[1];

    if (!FILE_EXTENSIONS.includes(fileExtension)) {
      return await ctx.reply(
        ctx.t('vision-incorrect-extension', { extensions: FILE_EXTENSIONS.join(', ') }),
        {
          reply_to_message_id: messageId,
        },
      );
    }

    await ctx.reply(ctx.t('vision-enter-query'));

    const {
      message: { text: query },
    } = await conversation.waitFor('message:text');

    if (Object.values(BotCommand).includes(query.slice(1) as BotCommand)) {
      return await ctx.reply(ctx.t('vision-empty-query', { command: query }));
    }

    const message = await gptLoader(ctx, messageId, { isVisionGenerator: true });

    const {
      vision: { model: visionModel },
    } = selectedModel;

    const response = await conversation.external(() =>
      visionCompletion(query, messageId, filename, telegramId, visionModel as unknown as string),
    );

    await message.delete();

    if (!response) {
      return await ctx.reply(ctx.t('error-message-common'), {
        reply_to_message_id: messageId,
      });
    }

    conversation.session.client.accountLevel = response.clientAccountLevel;

    return await ctx.reply(response.message.content, {
      parse_mode: 'Markdown',
      reply_markup: inlineFeedback(ctx),
      reply_to_message_id: messageId,
    });
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    Logger.error({
      context: 'src/conversations/vision.conversation.ts::visionConversation',
      message: error.message,
      stack: JSON.stringify(error),
    });

    return;
  }
};
