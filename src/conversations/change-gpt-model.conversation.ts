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

    const inlineClientGptModels = clientGptModels.map(
      ({ title, creator }) => `${title} by ${creator}`,
    );

    if (!inlineClientGptModels.length) {
      return await ctx.reply(ctx.t('error-message-common'), { reply_to_message_id: messageId });
    }

    const {
      gpt: selectedGptModel,
      image: selectedImageModel,
      speech: selectedSpeechModel,
    } = conversation.session.client.selectedModel;

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

    const gptCreator = text.slice(text.indexOf('by') + 2).trim();

    const newGptModel = clientGptModels.find(({ creator }) => creator === gptCreator);
    const newSpeechModel = clientSpeechModels.find(({ creator }) => creator === gptCreator);
    const newImageModel = clientImageModels.find(({ creator }) => creator === gptCreator);

    conversation.session.client.selectedModel = {
      gpt: {
        model: newGptModel?.model || selectedGptModel.model,
        title: newGptModel?.title || selectedGptModel.title,
      },
      speech: {
        model: newSpeechModel?.model || selectedSpeechModel.model,
        title: newSpeechModel?.title || selectedSpeechModel.title,
      },
      image: {
        max: newImageModel?.max || selectedImageModel.max,
        model: newImageModel?.model || selectedImageModel.model,
        title: newImageModel?.title || selectedImageModel.title,
      },
    };

    const changedModels = conversation.session.client.selectedModel;

    return await ctx.reply(
      `${ctx.t('gpt-model-change-success')}\n\r\n\r<b>${ctx.t('about-gpt-model')}</b> <s>${
        selectedGptModel.title
      }</s> ${changedModels.gpt.title}\n\r<b>${ctx.t('about-speech-model')}</b> <s>${
        selectedSpeechModel.title
      }</s> ${changedModels.speech.title}\n\r<b>${ctx.t('about-image-model')}</b> <s>${
        selectedImageModel.title
      }</s> ${changedModels.image.title}`,
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
