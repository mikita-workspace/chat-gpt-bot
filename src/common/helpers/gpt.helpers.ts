import { chatCompletion } from '@bot/api/gpt';
import { MAX_CONTEXT_TOKENS, MessageRolesGPT } from '@bot/api/gpt/constants';
import { BotContextType, SessionMessageType } from '@bot/app/types';
import { getTimestampUnix } from '@bot/common/utils';
import { encode } from 'gpt-3-encoder';

export const getGptContent = async (ctx: BotContextType, text: string) => {
  const telegramId = Number(ctx.message?.from?.id);
  const selectedGpt = ctx.session.client.selectedGpt;

  ctx.session.client.messages.push({
    content: text,
    role: MessageRolesGPT.USER,
  });

  const chatCompletionResponse = await chatCompletion(
    selectedGpt.model,
    ctx.session.client.messages,
    telegramId,
  );

  if (!chatCompletionResponse) {
    return null;
  }

  const content = chatCompletionResponse.message.content;
  const clientRate = chatCompletionResponse.clientRate;

  ctx.session.client.messages.push({
    content,
    role: MessageRolesGPT.ASSISTANT,
  });

  ctx.session.client.rate = clientRate;
  ctx.session.client.lastMessageTimestamp = getTimestampUnix();

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
