import { ModelGPT } from '@bot/constants';
import { customKeyboard } from '@bot/keyboards';
import { logger, mongo } from '@bot/services';
import { ConversationType } from '@bot/types';
import { mapGptModels } from 'helpers';

export const changeGptModelConversation: ConversationType = async (conversation, ctx) => {
  try {
    const availableGPTModels = (
      await conversation.external(() => mongo.getUser(String(ctx.from?.username)))
    )?.availableGPTModels ?? [ModelGPT.GPT_3_5_TURBO];
    const mappedGptModels = mapGptModels(availableGPTModels);

    const currentGptModel = conversation.session.client.selectedGptModel;

    await ctx.reply(ctx.t('gpt-model-change-title'), {
      reply_markup: customKeyboard(mappedGptModels),
    });

    const {
      message: { text },
    } = await conversation.waitFor('message:text');

    if (!mappedGptModels.includes(text)) {
      return await ctx.reply(
        ctx.t('error-message-change-gpt-model', { gptModel: currentGptModel }),
        {
          reply_markup: { remove_keyboard: true },
        },
      );
    }

    // TODO: Refactor it
    const newGptModel = text.split('[')[1].slice(0, -1);

    conversation.session.client.selectedGptModel = newGptModel as ModelGPT;

    return await ctx.reply(
      ctx.t('gpt-model-change-success', {
        prevGptModel: currentGptModel,
        currentGptModel: newGptModel,
      }),
      {
        reply_markup: { remove_keyboard: true },
      },
    );
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    logger.error(`conversations::changeGptModelConversation::${JSON.stringify(error.message)}`);

    return;
  }
};
