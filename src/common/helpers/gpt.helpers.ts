import { chatCompletion } from '@bot/api/gpt';
import { MAX_CONTEXT_TOKENS, MessageRolesGPT } from '@bot/api/gpt/constants';
import { BotContextType, SessionMessageType } from '@bot/app/types';
import { resetSelectedModel } from '@bot/common/helpers';
import { removeValueFromMemoryCache } from '@bot/common/utils';
import { encode } from 'gpt-3-encoder';

export const getGptContent = async (ctx: BotContextType, text: string) => {
  const telegramId = Number(ctx.message?.from?.id);
  const messageId = Number(ctx.message?.message_id);

  const { gpt: selectedGpt } = ctx.session.client.selectedModel;
  const currentRateName = ctx.session.client.accountLevel?.name;

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

  if (!clientAccountLevel.gptModels.includes(selectedGpt.model)) {
    ctx.session.client.selectedModel = resetSelectedModel();
  }

  if (clientAccountLevel.name !== currentRateName) {
    removeValueFromMemoryCache('cached-gpt-models');
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
  options?: { isImageGenerator?: boolean },
) => {
  const telegramId = Number(ctx.message?.from?.id);
  const username = ctx?.from?.username || 'username';

  return ctx.reply(
    `${ctx.t('loader-message-start')}<a href="${telegramId}"> @${username}</a>!\n\r${ctx.t(
      options?.isImageGenerator ? 'loader-message-image-end' : 'loader-message-end',
    )}`,
    { parse_mode: 'HTML', reply_to_message_id: messageId },
  );
};
