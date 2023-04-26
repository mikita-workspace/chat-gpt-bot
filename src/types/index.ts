import { ChatCompletionRequestMessage, OpenAIApi } from 'openai';
import { Context, Telegraf } from 'telegraf';
import { MessageRoles } from '../constants';

// Utils
interface IOggConverter {
  toMp3(input: string, output: string): void;
  create(url: string, filename: string): void;
}

interface IOpenAI {
  openAI: OpenAIApi;
  chat(messages: ChatCompletionRequestMessage[]): void;
  transcription(filepath: string): void;
}

// Telegraph
type SessionMessageType = {
  content: string;
  role: `${MessageRoles}`;
};

type BotContextType = Context & {
  session: {
    messages: SessionMessageType[];
  };
};

type BotType = Telegraf<BotContextType>;

export { BotType, BotContextType, IOggConverter, IOpenAI };
