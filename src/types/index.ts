import { ChatCompletionRequestMessage, OpenAIApi } from 'openai';
import { Context, Telegraf } from 'telegraf';
import { MessageRoles } from '../constants';

// Utils
export interface IOggConverter {
  toMp3(input: string, output: string): void;
  create(url: string, filename: string): void;
}

export interface IOpenAI {
  openAI: OpenAIApi;
  chat(messages: ChatCompletionRequestMessage[]): void;
  transcription(filepath: string): void;
}

// Telegraph
export type SessionMessageType = {
  content: string;
  role: `${MessageRoles}`;
};

export type BotContextType = Context & {
  readonly update?: {
    readonly message: {
      readonly from?: {
        readonly username?: string;
        readonly language_code?: string;
      };
    };
  };

  session: {
    messages: SessionMessageType[];
  };
};

export type BotType = Telegraf<BotContextType>;

// Middleware
export type TelegrafMiddlewareFn<Context> = (
  ctx: Context,
  next: () => Promise<void>,
) => Promise<void>;
