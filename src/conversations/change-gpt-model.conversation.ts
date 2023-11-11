import { getGptModels } from '@bot/api/gpt';
import { ModelGPT } from '@bot/api/gpt/constants';
import { ConversationType } from '@bot/conversations/types';
import { customKeyboard } from '@bot/keyboards';
import { Logger } from '@bot/services';

export const changeGptModelConversation: ConversationType = async (conversation, ctx) => {
  try {
    const clientModels = conversation.session.client.models;
    const availableModels = (await conversation.external(() => getGptModels()))
      .filter(({ model }) => clientModels.includes(model))
      .map(({ model, title, creator }) => [model, title, creator]);

    const selectedGpt = conversation.session.client.selectedGpt;

    const inlineModels = availableModels.map((model) => `${model[1]} (${model[0]}) by ${model[2]}`);

    await ctx.reply(ctx.t('gpt-model-change-title'), {
      reply_markup: customKeyboard(inlineModels),
    });

    const {
      message: { text },
    } = await conversation.waitFor('message:text');

    if (!inlineModels.includes(text)) {
      return await ctx.reply(
        ctx.t('error-message-change-gpt-model', { gptModel: selectedGpt.model }),
        {
          reply_markup: { remove_keyboard: true },
        },
      );
    }

    const newSelectedGptModel = text.slice(text.indexOf('(') + 1, text.indexOf(')')).trim();
    const newSelectedGptTitle = text.slice(0, text.indexOf('(')).trim();

    conversation.session.client.selectedGpt = {
      model: newSelectedGptModel as ModelGPT,
      title: newSelectedGptTitle,
    };

    return await ctx.reply(
      `${ctx.t('gpt-model-change-success')} <b><s>${
        selectedGpt.title
      }</s> ${newSelectedGptTitle}</b>`,
      {
        reply_markup: { remove_keyboard: true },
        parse_mode: 'HTML',
      },
    );
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    Logger.error(
      `src/conversations/change-gpt-model.conversation.ts::changeGptModelConversation::${JSON.stringify(
        error.message,
      )}`,
    );

    return;
  }
};
