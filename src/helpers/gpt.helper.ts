import { MessageRoles } from '@bot/constants';
import { logger, openAI } from '@bot/services';
import { BotContextType } from '@bot/types';
import { ChatCompletionRequestMessage } from 'openai';

export const convertGPTMessage = (
  content: ChatCompletionRequestMessage['content'],
  role = MessageRoles.USER,
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
      gptFormat: convertGPTMessage(response.content, MessageRoles.ASSISTANT),
      timestamp: Date.now(),
    });

    return response.content;
  } catch (error) {
    logger.error(`helper::getGPTMessage::${(error as Error).message}`);
  }
};
