import { unlink } from 'fs/promises';
import { MessageRoles } from '../constants';

export const removeFile = async (path: string) => {
  try {
    await unlink(path);
  } catch (error) {
    console.error(`ERROR::utils::removeFile::${(error as Error).message}`);
  }
};

export const isEmptyObject = (object: object) =>
  Object.keys(object).length === 0;

export const setEmptySession = () => ({
  messages: [],
  conversations: [],
});

export const mapContextData = (from: any) => ({
  telegramId: from.id,
  username: from.username,
  firstname: from.first_name,
});

export const convertGPTMessage = (content: any, role = MessageRoles.USER) => ({
  content,
  role,
});

// export function initCommand(message) {
//   return async function (ctx) {
//     ctx.session = emptySession();
//     await ctx.reply(message);
//   };
// }
export function printConversation(conversation: any) {
  if (!conversation) {
    return 'Error';
  }

  return conversation.messages
    .map((msg: any) => {
      if (msg.role === MessageRoles.USER) {
        return `<b>- ${msg.content}</b>\n\r\n\r`;
      }
      return `${msg.content}\n\r\n\r`;
    })
    .join('');
}
