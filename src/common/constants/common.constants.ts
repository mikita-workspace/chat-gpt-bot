export const botName = 'NovaChat | GPT';

export enum BotLanguageCodes {
  // TODO: Wiil be enabled later
  // BELORUSSIAN = 'be',
  ENGLISH = 'en',
  RUSSIAN = 'ru',
}

export enum BotCommands {
  ABOUT = 'about',
  CHANGE_MODEL = 'change',
  IMAGE = 'image',
  PROFILE = 'profile',
  RESTART = 'restart',
  START = 'start',
  SUPPORT = 'support',
}

export const BotCommandsWithDescription = [
  { command: BotCommands.RESTART, i18nKey: 'command-restart' },
  { command: BotCommands.CHANGE_MODEL, i18nKey: 'command-change-model' },
  { command: BotCommands.IMAGE, i18nKey: 'command-image' },
  { command: BotCommands.PROFILE, i18nKey: 'command-profile' },
  { command: BotCommands.ABOUT, i18nKey: 'command-about' },
  { command: BotCommands.SUPPORT, i18nKey: 'command-support' },
];

// Node cache
export const TTL_DEFAULT = process.env.NODE_ENV !== 'production' ? 60 : 600;
export const TTL_CONFIG_CACHE_DEFAULT = process.env.NODE_ENV !== 'production' ? 600 : 6000;

export const WEBHOOK_TIMEOUT = 60_000;

// Winston logger
export const winstonConfig = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6,
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'magenta',
    info: 'green',
    verbose: 'cyan',
    silly: 'grey',
  },
};

export enum CommonActions {
  GO_TO_CHAT = 'go-to-chat-action',
}

export enum AuthActions {
  GET_AUTH = 'get_auth_action',
}

export enum VoteActions {
  LIKE = 'like-vote-action',
  DISLIKE = 'dislike-vote-action',
}

export enum UserImagesMenuActions {
  CREATE_IMAGE = 'create-image-action',
}
