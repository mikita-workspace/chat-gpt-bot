import { chatCompletion } from '@bot/api/gpt';
import { MAX_CONTEXT_TOKENS, MessageRolesGPT } from '@bot/api/gpt/constants';
import { BotContextType, SessionMessageType } from '@bot/app/types';
import { encode } from 'gpt-3-encoder';

import { resetSelectedModel } from '../helpers';
import { removeValueFromMemoryCache } from '../utils';

export const getGptContent = async (ctx: BotContextType, text: string) => {
  const telegramId = Number(ctx.message?.from?.id);
  const messageId = Number(ctx.message?.message_id);

  const { gpt: selectedGpt } = ctx.session.selectedModel;
  const currentAccountLevelName = ctx.session.client.accountLevel?.name;

  ctx.session.client.messages.push({
    content: text,
    role: MessageRolesGPT.USER,
  });

  const chatCompletionResponse = await chatCompletion(
    ctx.session.client.messages,
    messageId,
    telegramId,
    selectedGpt.model,
  );

  if (!chatCompletionResponse) {
    return null;
  }

  const content = chatCompletionResponse.message.content;
  const clientAccountLevel = chatCompletionResponse.clientAccountLevel;

  ctx.session.client.messages.push({
    content,
    role: MessageRolesGPT.ASSISTANT,
  });

  ctx.session.client.accountLevel = clientAccountLevel;
  ctx.session.store.data = content;

  if (!clientAccountLevel.gptModels.includes(selectedGpt.model)) {
    ctx.session.selectedModel = resetSelectedModel();
  }

  if (clientAccountLevel.name !== currentAccountLevelName) {
    await removeValueFromMemoryCache('cached-gpt-models');
  }

  return content;
};

export const splitMessagesByTokenLimit = (
  messages: SessionMessageType[],
  tokenLimit = MAX_CONTEXT_TOKENS,
) => {
  let isLimitAchieved = false;

  const [headMessages, tailMessages] = messages
    .reverse()
    .reduce<[SessionMessageType[], SessionMessageType[]]>(
      ([head, tail], message) => {
        const amountOfTokens = encode([...head, message].join('')).length;

        if (amountOfTokens <= tokenLimit && !isLimitAchieved) {
          head.push(message);
        } else {
          isLimitAchieved = true;

          tail.push(message);
        }

        return [head, tail];
      },
      [[], []],
    );

  return [headMessages.reverse(), tailMessages.reverse()];
};

export const gptLoader = async (
  ctx: BotContextType,
  messageId: number,
  options?: { isImageGenerator?: boolean; isVisionGenerator?: boolean },
) => {
  const telegramId = Number(ctx.message?.from?.id);
  const username = ctx?.from?.username || 'username';

  const loaderMessage = () => {
    switch (true) {
      case options?.isImageGenerator:
        return 'loader-message-image-end';
      case options?.isVisionGenerator:
        return 'loader-message-vision-end';
      default:
        return 'loader-message-end';
    }
  };

  return ctx.reply(
    `${ctx.t('loader-message-start')}<a href="${telegramId}"> @${username}</a>!\n\r${ctx.t(
      loaderMessage(),
    )}`,
    { parse_mode: 'HTML', reply_to_message_id: messageId },
  );
};
