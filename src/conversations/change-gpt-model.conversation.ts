import { getGptModels } from '@bot/api/gpt';
import { MODEL_IMAGE_DEFAULT, MODEL_SPEECH_DEFAULT, TypeGPT } from '@bot/api/gpt/constants';
import { GptModelResponse } from '@bot/api/gpt/types';
import { BotCommand } from '@bot/common/constants';
import { gptKeyboard } from '@bot/keyboards';
import { Logger } from '@bot/services';

import { ConversationType } from './types';

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

        if (model.type === TypeGPT.AUDIO) {
          speechModels.push(model);
        }

        if (model.type === TypeGPT.IMAGE) {
          imageModels.push(model);
        }

        return [gptModels, speechModels, imageModels];
      },
      [[], [], []],
    );

    const inlineClientGptModels = clientGptModels
      .map(({ title, creator }) => `${title} by ${creator}`)
      .sort();

    if (!inlineClientGptModels.length) {
      return await ctx.reply(ctx.t('error-message-common'), { reply_to_message_id: messageId });
    }

    const {
      gpt: selectedGptModel,
      image: selectedImageModel,
      speech: selectedSpeechModel,
    } = conversation.session.client.selectedModel;

    await ctx.reply(ctx.t('gpt-model-change-title'), {
      reply_markup: gptKeyboard(inlineClientGptModels),
    });

    const {
      message: { text },
    } = await conversation.waitFor('message:text');

    if (Object.values(BotCommand).includes(text.slice(1) as BotCommand)) {
      return await ctx.reply(ctx.t('error-message-change-gpt-model', { command: text }), {
        reply_markup: { remove_keyboard: true },
      });
    }

    const [head, tail] = text.split('by');

    const gptTitle = head.trim();
    const gptCreator = tail.trim();

    const newGptModel = clientGptModels.find(
      ({ creator, title }) => creator === gptCreator && title === gptTitle,
    );

    const newSpeechModel = clientSpeechModels.find(({ associated }) =>
      associated.includes(newGptModel?.model || ''),
    );
    const newImageModel = clientImageModels.find(({ associated }) =>
      associated.includes(newGptModel?.model || ''),
    );

    conversation.session.client.selectedModel = {
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

    Logger.error({
      context: 'src/conversations/change-gpt-model.conversation.ts::changeGptModelConversation',
      message: error.message,
      stack: JSON.stringify(error),
    });

    return;
  }
};
