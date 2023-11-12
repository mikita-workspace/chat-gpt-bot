import { getGptModels } from '@bot/api/gpt';
import { TypeGPT } from '@bot/api/gpt/constants';
import { GptModelResponse } from '@bot/api/gpt/types';
import { ConversationType } from '@bot/conversations/types';
import { customKeyboard } from '@bot/keyboards';
import { Logger } from '@bot/services';

export const changeGptModelConversation: ConversationType = async (conversation, ctx) => {
  try {
    const telegramId = Number(ctx?.from?.id);
    const messageId = Number(ctx.message?.message_id);

    const [clientGptModels, clientSpeechModels, clientImageModels] = (
      await conversation.external(() => getGptModels(telegramId))
    ).reduce<[GptModelResponse[], GptModelResponse[], GptModelResponse[]]>(
      ([gptModels, speechModels, imageModels], model) => {
        if (model.type === TypeGPT.TEXT) {
          gptModels.push(model);
        }

        if (model.type === TypeGPT.SPEECH) {
          speechModels.push(model);
        }

        if (model.type === TypeGPT.IMAGE) {
          speechModels.push(model);
        }

        return [gptModels, speechModels, imageModels];
      },
      [[], [], []],
    );

    // TODO: Refactor it
    const inlineClientGptModels = clientGptModels.map(
      ({ title, model, creator }) => `${title} (${model}) by ${creator}`,
    );

    const {
      gpt: selectedGptModel,
      image: selectedImageModel,
      speech: selectedSpeechModel,
    } = conversation.session.client.selectedModel;

    if (!inlineClientGptModels.length) {
      return await ctx.reply(ctx.t('error-message-common'), { reply_to_message_id: messageId });
    }

    await ctx.reply(ctx.t('gpt-model-change-title'), {
      reply_markup: customKeyboard(inlineClientGptModels),
    });

    const {
      message: { text },
    } = await conversation.waitFor('message:text');

    if (!inlineClientGptModels.includes(text)) {
      return await ctx.reply(ctx.t('error-message-change-gpt-model'), {
        reply_markup: { remove_keyboard: true },
      });
    }

    const newSelectedGptCreator = text.slice(text.indexOf('by') + 2).trim();

    const newSelectedSpeechModel = clientSpeechModels.find(
      ({ creator }) => creator === newSelectedGptCreator,
    );
    const newSelectedImageModel = clientImageModels.find(
      ({ creator }) => creator === newSelectedGptCreator,
    );

    const newSelectedGptModel = text.slice(text.indexOf('(') + 1, text.indexOf(')')).trim();
    const newSelectedGptTitle = text.slice(0, text.indexOf('(')).trim();

    const newSelectedSpeechModelModel = newSelectedSpeechModel?.model || selectedSpeechModel.model;
    const newSelectedSpeechModelTitle = newSelectedSpeechModel?.title || selectedSpeechModel.title;

    const newSelectedImageModelModel = newSelectedImageModel?.model || selectedImageModel.model;
    const newSelectedImageModelTitle = newSelectedImageModel?.title || selectedImageModel.title;

    conversation.session.client.selectedModel = {
      gpt: {
        model: newSelectedGptModel,
        title: newSelectedGptTitle,
      },
      speech: {
        model: newSelectedSpeechModelModel,
        title: newSelectedSpeechModelTitle,
      },
      image: {
        model: newSelectedImageModelModel,
        title: newSelectedImageModelTitle,
      },
    };

    return await ctx.reply(
      `${ctx.t('gpt-model-change-success')}\n\r\n\r<b>${ctx.t('about-gpt-model')} <s>${
        selectedGptModel.title
      }</s> <code>${newSelectedGptTitle}</code></b>\n\r<b>${ctx.t('about-speech-model')} <s>${
        selectedSpeechModel.title
      }</s> <code>${newSelectedSpeechModelTitle}</code></b>\n\r<b>${ctx.t(
        'about-image-model',
      )} <s>${selectedImageModel.title}</s> <code>${newSelectedImageModelTitle}</code></b>`,
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
