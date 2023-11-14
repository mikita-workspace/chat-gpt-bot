export const botName = 'NovaChat | GPT';

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
  { command: BotCommands.IMAGE, i18nKey: 'command-image' },
  { command: BotCommands.PROFILE, i18nKey: 'command-profile' },
  { command: BotCommands.CHANGE_MODEL, i18nKey: 'command-change-model' },
  { command: BotCommands.ABOUT, i18nKey: 'command-about' },
  // TODO: Will be implemented here: https://app.asana.com/0/1205877070000801/1205877070000832/f
  // { command: BotCommands.SUPPORT, i18nKey: 'command-support' },
];

export enum LocaleCodes {
  BELORUSSIAN = 'be',
  ENGLISH = 'en',
  RUSSIAN = 'ru',
}

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

export enum ClientImagesMenuActions {
  GENERATE_IMAGE = 'generate-image-action',
}

export enum FeedbackActions {
  DISLIKE = 'dislike-feedback-action',
  DISLIKE_IMAGE = 'dislike-image-feedback-action',
  LIKE = 'like-feedback-action',
  LIKE_IMAGE = 'like-image-feedback-action',
}
