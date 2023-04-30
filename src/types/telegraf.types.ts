import { Context, Telegraf } from 'telegraf';
import { MessageRoles } from '../constants';

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
