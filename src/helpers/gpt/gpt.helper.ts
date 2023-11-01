import { MAX_CONTEXT_GPT_TOKENS, MessageRolesGPT, ModelGPT } from '@bot/constants';
import { gigaChat, logger, mongo, openAI } from '@bot/services';
import { BotContextType, SessionMessageType } from '@bot/types';
import { getTimezoneString, parseTimestampUTC } from '@bot/utils';
import { encode } from 'gpt-3-encoder';
import { ChatCompletionRequestMessage } from 'openai';

export const gptModelRunning = {
  [ModelGPT.GIGA_CHAT]: gigaChat,
  [ModelGPT.GPT_3_5_TURBO]: openAI,
  [ModelGPT.WHISPER_1]: openAI,
};

export const splitSessionMessagesByTokenLimit = (
  messages: SessionMessageType[],
  tokenLimit = MAX_CONTEXT_GPT_TOKENS,
) => {
  let isLimitAchieved = false;

  const [headMessages, tailMessages] = messages
    .reverse()
    .reduce<[SessionMessageType[], SessionMessageType[]]>(
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

export const convertGPTMessage = (
  content: ChatCompletionRequestMessage['content'],
  role = MessageRolesGPT.USER,
) => ({
  content,
  role,
});

export const getGPTAnswer = async (ctx: BotContextType, text: string) => {
  try {
    const username = String(ctx?.from?.username);

    const usedGptTokens = ctx.session.settings.amountOfGptTokens;
    const selectedGPTModel = ctx.session.settings.selectedGPTModel;

    const currentLocale = await ctx.i18n.getLocale();

    const user = await mongo.getUser(username);

    if (user && usedGptTokens >= user.limit.gptTokens) {
      const limitDate = new Date(user.limit.expire);

      return ctx.t('info-message-reach-gpt-tokens-limit', {
        date: limitDate.toLocaleString(currentLocale),
        utc: getTimezoneString(limitDate.getTimezoneOffset()),
      });
    }

    ctx.session.user.messages.push({
      gptFormat: convertGPTMessage(text),
      timestamp: parseTimestampUTC(Date.now()),
    });

    const response = await gptModelRunning[selectedGPTModel].chat(
      ctx.session.user.messages.map(({ gptFormat }) => gptFormat),
    );

    if (!response) {
      return '';
    }

    const { message, usage } = response ?? {};

    ctx.session.user.messages.push({
      gptFormat: convertGPTMessage(message.content, MessageRolesGPT.ASSISTANT),
      timestamp: parseTimestampUTC(Date.now()),
    });

    ctx.session.settings.amountOfGptTokens += usage.total_tokens;

    return message.content;
  } catch (error) {
    logger.error(`helper::getGPTMessage::${JSON.stringify(error.message)}`);
  }
};
