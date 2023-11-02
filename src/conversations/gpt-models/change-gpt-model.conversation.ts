import { ModelGPT } from '@bot/constants';
import { customKeyboard } from '@bot/keyboards';
import { logger, mongo } from '@bot/services';
import { ConversationType } from '@bot/types';

export const changeGptModelConversation: ConversationType = async (conversation, ctx) => {
  try {
    const availableGPTModels = (
      await conversation.external(() => mongo.getUser(String(ctx.from?.username)))
    )?.availableGPTModels ?? [ModelGPT.GPT_3_5_TURBO];

    const currentGptModel = conversation.session.settings.selectedGPTModel;

    await ctx.reply(ctx.t('gpt-model-change-title'), {
      reply_markup: customKeyboard(availableGPTModels),
    });

    const {
      message: { text },
    } = await conversation.waitFor('message:text');

    if (![ModelGPT.GIGA_CHAT, ModelGPT.GPT_3_5_TURBO].includes(text as ModelGPT)) {
      return await ctx.reply(
        ctx.t('error-message-change-gpt-model', { gptModel: currentGptModel }),
        {
          reply_markup: { remove_keyboard: true },
        },
      );
    }

    conversation.session.settings.selectedGPTModel = text as ModelGPT;

    return await ctx.reply(
      ctx.t('gpt-model-change-success', { prevGptModel: currentGptModel, currentGptModel: text }),
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
