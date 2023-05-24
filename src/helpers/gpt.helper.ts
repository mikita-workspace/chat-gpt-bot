import { MAX_CONTEXT_GPT_TOKENS, MessageRolesGPT } from '@bot/constants';
import { logger, openAI } from '@bot/services';
import { BotContextType, SessionMessagesType } from '@bot/types';
import { encode } from 'gpt-3-encoder';
import { ChatCompletionRequestMessage } from 'openai';

export const convertGPTMessage = (
  content: ChatCompletionRequestMessage['content'],
  role = MessageRolesGPT.USER,
) => ({
  content,
  role,
});

export const getGPTAnswer = async (ctx: BotContextType, text = '') => {
  try {
    ctx.session.custom.messages.push({
      gptFormat: convertGPTMessage(text),
      timestamp: Date.now(),
    });

    const response = await openAI.chat(
      ctx.session.custom.messages.map(({ gptFormat }) => gptFormat),
    );

    if (!response) {
      return '';
    }

    ctx.session.custom.messages.push({
      gptFormat: convertGPTMessage(response.content, MessageRolesGPT.ASSISTANT),
      timestamp: Date.now(),
    });

    return response.content;
  } catch (error) {
    logger.error(`helper::getGPTMessage::${(error as Error).message}`);
  }
};

export const splitSessionMessagesByTokenLimit = (
  messages: SessionMessagesType,
  tokenLimit = MAX_CONTEXT_GPT_TOKENS,
) => {
  let isLimitAchieved = false;

  const [headMessages, tailMessages] = messages
    .reverse()
    .reduce<[SessionMessagesType, SessionMessagesType]>(
      ([head, tail], message) => {
        const amountTokens = encode(
          [...head, message].map((msg) => msg.gptFormat.content).join(''),
        ).length;

        if (amountTokens <= tokenLimit && !isLimitAchieved) {
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
