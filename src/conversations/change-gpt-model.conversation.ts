import { getGptModels } from '@bot/api/gpt';
import { ModelGPT } from '@bot/api/gpt/constants';
import { customKeyboard } from '@bot/keyboards';
import { logger } from '@bot/services';
import { ConversationType } from '@bot/types';

export const changeGptModelConversation: ConversationType = async (conversation, ctx) => {
  try {
    const clientModels = conversation.session.client.models;
    const availableModels = (await conversation.external(() => getGptModels()))
      .filter(({ model }) => clientModels.includes(model))
      .map(({ model, title, creator }) => [model, title, creator]);

    const selectedGptModel = conversation.session.client.selectedGptModel;

    const inlineModels = availableModels.map((model) => `${model[1]} (${model[0]}) by ${model[2]}`);

    await ctx.reply(ctx.t('gpt-model-change-title'), {
      reply_markup: customKeyboard(inlineModels),
    });

    const {
      message: { text },
    } = await conversation.waitFor('message:text');

    if (!inlineModels.includes(text)) {
      return await ctx.reply(
        ctx.t('error-message-change-gpt-model', { gptModel: selectedGptModel }),
        {
          reply_markup: { remove_keyboard: true },
        },
      );
    }

    const newSelectedGptModel = text.slice(text.indexOf('(') + 1, text.indexOf(')'));

    conversation.session.client.selectedGptModel = newSelectedGptModel as ModelGPT;

    return await ctx.reply(
      ctx.t('gpt-model-change-success', {
        prevModel: selectedGptModel,
        currentModel: newSelectedGptModel,
      }),
      {
        reply_markup: { remove_keyboard: true },
      },
    );
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    logger.error(
      `src/conversations/change-gpt-model.conversation.ts::changeGptModelConversation::${JSON.stringify(
        error.message,
      )}`,
    );

    return;
  }
};
