import { MAX_CONTEXT_GPT_TOKENS, MessageRolesGPT, ModelGPT } from '@bot/constants';
import { gigaChat, logger, mongo, openAI } from '@bot/services';
import { BotContextType, SessionMessageType } from '@bot/types';
import { getTimestampUnix, getTimezoneString } from '@bot/utils';
import { encode } from 'gpt-3-encoder';
import { ChatCompletionRequestMessage } from 'openai';

export const gptModelRunning = {
  [ModelGPT.GIGA_CHAT]: gigaChat,
  [ModelGPT.GPT_3_5_TURBO]: openAI,
  [ModelGPT.WHISPER_1]: openAI,
};

export const splitMessagesByTokenLimit = (
  messages: SessionMessageType[],
  tokenLimit = MAX_CONTEXT_GPT_TOKENS,
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

    // const usedGptTokens = ctx.session.client.rate.gptTokens;
    const selectedGPTModel = ctx.session.client.selectedGptModel;

    const currentLocale = await ctx.i18n.getLocale();

    const user = await mongo.getUser(username);

    // if (user && usedGptTokens >= user.limit.gptTokens) {
    //   const limitDate = new Date(user.limit.expire);

    //   return ctx.t('info-message-reach-gpt-tokens-limit', {
    //     date: limitDate.toLocaleString(currentLocale),
    //     utc: getTimezoneString(limitDate.getTimezoneOffset()),
    //   });
    // }

    // ctx.session.client.messages.push({
    //   gptFormat: convertGPTMessage(text),
    //   timestamp: getTimestampUnix(Date.now()),
    // });

    // const response = await gptModelRunning[selectedGPTModel].chat(
    //   ctx.session.client.messages.map(({ gptFormat }) => gptFormat),
    // );

    // if (!response) {
    //   return '';
    // }

    // const { message, usage } = response ?? {};

    // ctx.session.client.messages.push({
    //   gptFormat: convertGPTMessage(message.content, MessageRolesGPT.ASSISTANT),
    //   timestamp: getTimestampUnix(Date.now()),
    // });

    // ctx.session.client.rate.gptTokens += usage.total_tokens;

    // return message.content;
    return '';
  } catch (error) {
    logger.error(`helper::getGPTMessage::${JSON.stringify(error.message)}`);
  }
};

export const mapGptModels = <T>(models: T[]) =>
  models.reduce<string[]>((acc, currentModel) => {
    if (currentModel === ModelGPT.GIGA_CHAT) {
      acc.push(`🇷🇺 Sber::Text [${currentModel}]`);
    }

    if (currentModel === ModelGPT.GPT_3_5_TURBO) {
      acc.push(`🇺🇸 OpenAI::Text&Voice [${currentModel}]`);
    }

    return acc;
  }, []);
