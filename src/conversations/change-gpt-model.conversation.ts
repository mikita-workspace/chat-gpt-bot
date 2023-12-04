import { getGptModels } from '@bot/api/gpt';
import { MODEL_IMAGE_DEFAULT, MODEL_SPEECH_DEFAULT, TypeGPT } from '@bot/api/gpt/constants';
import { GptModelResponse } from '@bot/api/gpt/types';
import { BotCommand, SELECTED_MODEL_KEY, TTL_SELECTED_MODEL_CACHE } from '@bot/common/constants';
import { resetSelectedModel } from '@bot/common/helpers';
import { fetchCachedData, setValueToMemoryCache } from '@bot/common/utils';
import { gptKeyboard } from '@bot/keyboards';
import { Logger } from '@bot/services';

import { ConversationType } from './types';

export const changeGptModelConversation: ConversationType = async (conversation, ctx) => {
  try {
    const telegramId = Number(ctx?.from?.id);
    const messageId = Number(ctx.message?.message_id);

    const [clientGptModels, clientSpeechModels, clientImageModels, clientVisionModels] = (
      await conversation.external(() => getGptModels(telegramId))
    ).reduce<[GptModelResponse[], GptModelResponse[], GptModelResponse[], GptModelResponse[]]>(
      ([gptModels, speechModels, imageModels, visionModels], model) => {
        if (model.type === TypeGPT.TEXT) {
          gptModels.push(model);
        }

        if (model.type === TypeGPT.AUDIO) {
          speechModels.push(model);
        }

        if (model.type === TypeGPT.IMAGE) {
          imageModels.push(model);
        }

        if (model.type === TypeGPT.VISION) {
          visionModels.push(model);
        }

        return [gptModels, speechModels, imageModels, visionModels];
      },
      [[], [], [], []],
    );

    const inlineClientGptModels = clientGptModels.map(({ title }) => title).sort();

    if (!inlineClientGptModels.length) {
      return await ctx.reply(ctx.t('error-message-common'), { reply_to_message_id: messageId });
    }

    const selectedModel = await conversation.external(async () =>
      fetchCachedData(
        `${SELECTED_MODEL_KEY}-${telegramId}`,
        resetSelectedModel,
        TTL_SELECTED_MODEL_CACHE,
      ),
    );

    const {
      gpt: selectedGptModel,
      image: selectedImageModel,
      speech: selectedSpeechModel,
    } = selectedModel;

    await ctx.reply(ctx.t('gpt-model-change-title'), {
      reply_markup: gptKeyboard(inlineClientGptModels),
    });

    const {
      message: { text: gptTitle },
    } = await conversation.waitFor('message:text');

    if (Object.values(BotCommand).includes(gptTitle.slice(1) as BotCommand)) {
      return await ctx.reply(ctx.t('error-message-change-gpt-model', { command: gptTitle }), {
        reply_markup: { remove_keyboard: true },
      });
    }

    const newGptModel = clientGptModels.find(({ title }) => title === gptTitle.trim());

    const newSpeechModel = clientSpeechModels.find(({ associated }) =>
      associated.includes(newGptModel?.model || ''),
    );
    const newImageModel = clientImageModels.find(({ associated }) =>
      associated.includes(newGptModel?.model || ''),
    );
    const newVisionModel = clientVisionModels.find(({ associated }) =>
      associated.includes(newGptModel?.model || ''),
    );

    const changedModels = {
      gpt: {
        model: newGptModel?.model || selectedGptModel.model,
        title: newGptModel?.title || selectedGptModel.title,
      },
      speech: {
        model: newSpeechModel?.model || MODEL_SPEECH_DEFAULT.model,
        title: newSpeechModel?.title || MODEL_SPEECH_DEFAULT.title,
      },
      image: {
        max: newImageModel?.max || MODEL_IMAGE_DEFAULT.max,
        model: newImageModel?.model || MODEL_IMAGE_DEFAULT.model,
        title: newImageModel?.title || MODEL_IMAGE_DEFAULT.title,
      },
      vision: {
        model: newVisionModel?.model || null,
        title: newVisionModel?.title || null,
      },
    };

    await setValueToMemoryCache(
      `${SELECTED_MODEL_KEY}-${telegramId}`,
      JSON.stringify(changedModels),
      TTL_SELECTED_MODEL_CACHE,
    );

    return await ctx.reply(
      `${ctx.t('gpt-model-change-success')}\n\r\n\r<b>${ctx.t('about-gpt-model')}</b> <s>${
        selectedGptModel.title
      }</s> ${changedModels.gpt.title}\n\r<b>${ctx.t('about-speech-model')}</b> <s>${
        selectedSpeechModel.title
      }</s> ${changedModels.speech.title}\n\r<b>${ctx.t('about-image-model')}</b> <s>${
        selectedImageModel.title
      }</s> ${changedModels.image.title}${
        changedModels.vision.title
          ? `\n\r<b>${ctx.t('about-vision-model')}</b> ${changedModels.vision.title}`
          : ''
      }\n\r\n\r<b>by ${newGptModel?.creator || ''}</b>`,
      {
        reply_markup: { remove_keyboard: true },
        parse_mode: 'HTML',
      },
    );
  } catch (error) {
    await ctx.reply(ctx.t('error-message-common'));

    Logger.error({
      context: 'src/conversations/change-gpt-model.conversation.ts::changeGptModelConversation',
      message: error.message,
      stack: JSON.stringify(error),
    });

    return;
  }
};
