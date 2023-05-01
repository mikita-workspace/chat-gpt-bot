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
    ctx.session.messages.push(convertGPTMessage(text));

    const response = await openAI.chat(ctx.session.messages);

    if (!response) {
      return '';
    }

    ctx.session.messages.push(
      convertGPTMessage(response.content, MessageRoles.ASSISTANT),
    );

    return response.content;
  } catch (error) {
    console.error(`ERROR::helper::getGPTMessage::${(error as Error).message}`);
  }
};
