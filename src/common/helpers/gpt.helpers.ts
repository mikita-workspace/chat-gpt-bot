import { chatCompletion } from '@bot/api/gpt';
import { MessageRolesGPT, ModelGPT } from '@bot/api/gpt/constants';
import { BotContextType } from '@bot/types';

export const gptMessage = async (ctx: BotContextType, text: string, model: `${ModelGPT}`) => {
  ctx.session.client.messages.push({
    content: text,
    role: MessageRolesGPT.USER,
  });

  const chatCompletionResponse = await chatCompletion(model, ctx.session.client.messages);

  if (!chatCompletionResponse) {
    return null;
  }

  const content = chatCompletionResponse.message.content;

  ctx.session.client.messages.push({
    content,
    role: MessageRolesGPT.ASSISTANT,
  });

  return content;
};
