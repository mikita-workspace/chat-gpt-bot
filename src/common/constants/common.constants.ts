export const botName = 'NovaChat | GPT';

export enum BotCommand {
  ABOUT = 'about',
  CHANGE_MODEL = 'gpt',
  IMAGE = 'image',
  PROFILE = 'profile',
  RESTART = 'restart',
  START = 'start',
  SUPPORT = 'support',
}

export const BotCommandDescription = [
  { command: BotCommand.RESTART, i18nKey: 'command-restart' },
  { command: BotCommand.IMAGE, i18nKey: 'command-image' },
  { command: BotCommand.CHANGE_MODEL, i18nKey: 'command-change-model' },
  { command: BotCommand.PROFILE, i18nKey: 'command-profile' },
  { command: BotCommand.ABOUT, i18nKey: 'command-about' },
  { command: BotCommand.SUPPORT, i18nKey: 'command-support' },
];

export enum LocaleCode {
  BELORUSSIAN = 'be',
  ENGLISH = 'en',
  RUSSIAN = 'ru',
}

export enum LocaleName {
  BELORUSSIAN = 'Беларускі',
  ENGLISH = 'English',
  RUSSIAN = 'Русский',
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

export enum CommonAction {
  GO_TO_CHAT = 'go-to-chat-action',
}

export enum AuthAction {
  GET_AUTH = 'get_auth_action',
}

export enum FeedbackAction {
  DISLIKE = 'dislike-feedback-action',
  DISLIKE_IMAGE = 'dislike-image-feedback-action',
  LIKE = 'like-feedback-action',
  LIKE_IMAGE = 'like-image-feedback-action',
}
