import { openAI } from '../services';
import { ChatCompletionRequestMessage } from 'openai';
import { BotContextType } from '../types';
import { MessageRoles } from '../constants';

export const convertGPTMessage = (
  content: ChatCompletionRequestMessage['content'],
  role = MessageRoles.USER,
) => ({
  content,
  role,
});

export const getGPTAnswer = async (ctx: BotContextType, text = '') => {
  try {
    ctx.session.messages.push({
      gptFormat: convertGPTMessage(text),
      timestamp: Date.now(),
    });

    const response = await openAI.chat(ctx.session.messages.map(({ gptFormat }) => gptFormat));

    if (!response) {
      return '';
    }

    ctx.session.messages.push({
      gptFormat: convertGPTMessage(response.content, MessageRoles.ASSISTANT),
      timestamp: Date.now(),
    });

    return response.content;
  } catch (error) {
    console.error(`ERROR::helper::getGPTMessage::${(error as Error).message}`);
  }
};
