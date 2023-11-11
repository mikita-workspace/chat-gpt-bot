import { getGptModels } from '@bot/api/gpt';
import { TypeGPT } from '@bot/api/gpt/constants';
import { GptModelsResponse } from '@bot/api/gpt/types';
import { ConversationType } from '@bot/conversations/types';
import { customKeyboard } from '@bot/keyboards';
import { Logger } from '@bot/services';

export const changeGptModelConversation: ConversationType = async (conversation, ctx) => {
  try {
    const telegramId = Number(ctx?.from?.id);

    const [clientGptModels, clientSpeechModels] = (
      await conversation.external(() => getGptModels(telegramId))
    ).reduce<[GptModelsResponse[], GptModelsResponse[]]>(
      ([gptModels, speechModels], model) => {
        if (model.type === TypeGPT.TEXT) {
          gptModels.push(model);
        }

        if (model.type === TypeGPT.SPEECH) {
          speechModels.push(model);
        }

        return [gptModels, speechModels];
      },
      [[], []],
    );

    const inlineClientGptModels = clientGptModels.map(
      ({ title, model, creator }) => `${title} (${model}) by ${creator}`,
    );

    const { gpt: selectedGptModel, speech: selectedSpeechModel } =
      conversation.session.client.selectedModel;

    await ctx.reply(ctx.t('gpt-model-change-title'), {
      reply_markup: customKeyboard(inlineClientGptModels),
    });

    const {
      message: { text },
    } = await conversation.waitFor('message:text');

    if (!inlineClientGptModels.includes(text)) {
      return await ctx.reply(
        ctx.t('error-message-change-gpt-model', { gptModel: selectedGptModel.title }),
        {
          reply_markup: { remove_keyboard: true },
        },
      );
    }

    const newSelectedGptModel = text.slice(text.indexOf('(') + 1, text.indexOf(')')).trim();
    const newSelectedGptTitle = text.slice(0, text.indexOf('(')).trim();
    const newSelectedGptCreator = text.slice(text.indexOf('by') + 2).trim();

    const newSelectedSpeechModel = clientSpeechModels.find(
      ({ creator }) => creator === newSelectedGptCreator,
    );

    conversation.session.client.selectedModel = {
      gpt: {
        model: newSelectedGptModel,
        title: newSelectedGptTitle,
      },
      speech: {
        model: newSelectedSpeechModel?.model || selectedSpeechModel.model,
        title: newSelectedSpeechModel?.title || selectedSpeechModel.title,
      },
    };

    return await ctx.reply(
      `${ctx.t('gpt-model-change-success')} <b><s>${
        selectedGptModel.title
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
